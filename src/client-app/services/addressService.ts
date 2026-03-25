import { supabase } from '../lib/supabase'
import { Address } from '../types/models'

type AddressFromDB = {
  id: string;
  user_id: string;
  house_address: string;
  street_address: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_primary: boolean;
};

/**
 * Maps database address format to application Address model
 */
function mapAddressFromDB(dbAddress: AddressFromDB): Address {
  return {
    id: dbAddress.id,
    houseAddress: dbAddress.house_address,
    streetAddress: dbAddress.street_address,
    city: dbAddress.city,
    state: dbAddress.state,
    country: dbAddress.country || "India",
    pincode: dbAddress.pincode,
    isPrimary: dbAddress.is_primary || false,
  };
}

/**
 * Maps application Address model to database format
 */
function mapAddressToDB(address: Address, userId: string): Omit<AddressFromDB, "id"> {
  return {
    user_id: userId,
    house_address: address.houseAddress,
    street_address: address.streetAddress || null,
    city: address.city,
    state: address.state,
    country: address.country || "India",
    pincode: address.pincode,
    is_primary: address.isPrimary || false,
  };
}

/**
 * Helper function to check if a string is a valid UUID
 */
function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export const addressService = {
  /**
   * Fetches all addresses for a given user_id from Supabase
   */
  async fetchAddresses(userId: string): Promise<Address[]> {
    try {
      console.log("Fetching addresses for user_id:", userId);

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching addresses from Supabase:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No addresses found for user_id:", userId);
        return [];
      }

      const addresses = data.map(mapAddressFromDB);
      console.log(`Fetched ${addresses.length} addresses successfully`);
      return addresses;
    } catch (error) {
      console.error("Unexpected error fetching addresses:", error);
      return [];
    }
  },

  /**
   * Saves or updates addresses for a user
   * This will:
   * 1. Get all existing addresses for the user
   * 2. Update existing addresses that are in the new list
   * 3. Insert new addresses that don't have database IDs
   * 4. Delete addresses that are no longer in the list
   * This prevents duplicates and ensures data consistency
   */
  async saveAddresses(userId: string, addresses: Address[]): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Saving ${addresses.length} addresses for user_id:`, userId);

      // If no addresses, delete all existing ones
      if (addresses.length === 0) {
        const { error: deleteError } = await supabase
          .from("addresses")
          .delete()
          .eq("user_id", userId);

        if (deleteError) {
          console.error("Error deleting addresses:", deleteError);
          return {
            success: false,
            message: deleteError.message || "Failed to delete addresses",
          };
        }

        return {
          success: true,
          message: "Addresses cleared successfully",
        };
      }

      // Get all existing addresses for this user
      const { data: existingAddresses, error: fetchError } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", userId);

      if (fetchError) {
        console.error("Error fetching existing addresses:", fetchError);
        return {
          success: false,
          message: fetchError.message || "Failed to fetch existing addresses",
        };
      }

      const existingIds = new Set(existingAddresses?.map((addr) => addr.id) || []);

      // Separate addresses into updates and inserts
      const addressesToUpdate: Array<AddressFromDB & { id: string }> = [];
      const addressesToInsert: Omit<AddressFromDB, "id">[] = [];

      for (const addr of addresses) {
        const dbAddress = mapAddressToDB(addr, userId);
        
        // If address has a valid UUID and exists in database, update it
        if (addr.id && isValidUUID(addr.id) && existingIds.has(addr.id)) {
          addressesToUpdate.push({ ...dbAddress, id: addr.id });
        } else {
          // Otherwise, it's a new address (insert)
          addressesToInsert.push(dbAddress);
        }
      }

      // Update existing addresses
      if (addressesToUpdate.length > 0) {
        for (const addr of addressesToUpdate) {
          const { id, ...updateData } = addr;
          const { error: updateError } = await supabase
            .from("addresses")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", userId);

          if (updateError) {
            console.error(`Error updating address ${id}:`, updateError);
            return {
              success: false,
              message: updateError.message || "Failed to update address",
            };
          }
        }
      }

      // Insert new addresses
      if (addressesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("addresses")
          .insert(addressesToInsert);

        if (insertError) {
          console.error("Error inserting addresses:", insertError);
          return {
            success: false,
            message: insertError.message || "Failed to insert addresses",
          };
        }
      }

      // Delete addresses that are no longer in the list
      const newAddressIds = new Set(
        addresses
          .map((addr) => addr.id)
          .filter((id) => id && isValidUUID(id))
      );
      const idsToDelete = Array.from(existingIds).filter((id) => !newAddressIds.has(id));
      
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("addresses")
          .delete()
          .eq("user_id", userId)
          .in("id", idsToDelete);

        if (deleteError) {
          console.error("Error deleting removed addresses:", deleteError);
          // Don't fail the whole operation if delete fails, but log it
          console.warn("Some addresses may not have been deleted");
        }
      }

      console.log("Addresses saved successfully");
      return {
        success: true,
        message: "Addresses saved successfully",
      };
    } catch (error) {
      console.error("Unexpected error saving addresses:", error);
      return {
        success: false,
        message: "An unexpected error occurred while saving addresses",
      };
    }
  },

  /**
   * Creates a single address
   */
  async createAddress(userId: string, address: Omit<Address, "id">): Promise<{ success: boolean; address?: Address; message: string }> {
    try {
      const addressToInsert = mapAddressToDB({ ...address, id: "" }, userId);

      const { data, error } = await supabase
        .from("addresses")
        .insert(addressToInsert)
        .select()
        .single();

      if (error) {
        console.error("Error creating address:", error);
        return {
          success: false,
          message: error.message || "Failed to create address",
        };
      }

      return {
        success: true,
        address: mapAddressFromDB(data),
        message: "Address created successfully",
      };
    } catch (error) {
      console.error("Unexpected error creating address:", error);
      return {
        success: false,
        message: "An unexpected error occurred while creating address",
      };
    }
  },

  /**
   * Updates a single address
   */
  async updateAddress(addressId: string, address: Partial<Address>, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: Partial<AddressFromDB> = {};

      if (address.houseAddress !== undefined) updateData.house_address = address.houseAddress;
      if (address.streetAddress !== undefined) updateData.street_address = address.streetAddress || null;
      if (address.city !== undefined) updateData.city = address.city;
      if (address.state !== undefined) updateData.state = address.state;
      if (address.country !== undefined) updateData.country = address.country;
      if (address.pincode !== undefined) updateData.pincode = address.pincode;
      if (address.isPrimary !== undefined) updateData.is_primary = address.isPrimary;

      const { error } = await supabase
        .from("addresses")
        .update(updateData)
        .eq("id", addressId)
        .eq("user_id", userId); // Ensure user owns this address

      if (error) {
        console.error("Error updating address:", error);
        return {
          success: false,
          message: error.message || "Failed to update address",
        };
      }

      return {
        success: true,
        message: "Address updated successfully",
      };
    } catch (error) {
      console.error("Unexpected error updating address:", error);
      return {
        success: false,
        message: "An unexpected error occurred while updating address",
      };
    }
  },

  /**
   * Deletes a single address
   */
  async deleteAddress(addressId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", userId); // Ensure user owns this address

      if (error) {
        console.error("Error deleting address:", error);
        return {
          success: false,
          message: error.message || "Failed to delete address",
        };
      }

      return {
        success: true,
        message: "Address deleted successfully",
      };
    } catch (error) {
      console.error("Unexpected error deleting address:", error);
      return {
        success: false,
        message: "An unexpected error occurred while deleting address",
      };
    }
  },
};

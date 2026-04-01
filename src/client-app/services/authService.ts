import { User } from '../types/models'
import { sessionManager } from './sessionManager'
import { supabase } from '../lib/supabase'
import { profileService } from './profileService'
import { doctorService } from './doctorService'
import { organizationService } from './organizationService'

const NOT_CLIENT_MESSAGE =
  "This phone number is already registered as a Caregiver on the Ambimed Caregiver app and cannot be used on the Ambimed app.\n\nFor assistance, please contact customer care at +91 8726568502."

const NOT_REGISTERED_MESSAGE =
  'No Ambimed account was found for this number. Please contact customer care if you need help.'

function canUseClientApp(
  profile: Awaited<ReturnType<typeof profileService.fetchProfile>>,
  isDoctorUid: boolean,
  isCorporateUser: boolean,
): boolean {
  if (profile?.role === 'worker') return false
  if (profile?.role === 'client' || profile?.role === 'doctor') return true
  if (isDoctorUid) return true
  if (isCorporateUser) return true
  return false
}

// Helper function to normalize phone number to E.164 format
function normalizePhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, "");

  // If it doesn't start with +, assume it's an Indian number and add +91
  if (!phoneNumber.startsWith("+")) {
    // If it starts with 0, remove it
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    // If it doesn't start with country code, add +91 for India
    if (!cleaned.startsWith("91") && cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }
    return "+" + cleaned;
  }

  return phoneNumber;
}

export const authService = {
  async sendOtp(
    mobileNumber: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Normalize phone number to E.164 format
      const normalizedPhone = normalizePhoneNumber(mobileNumber);
      console.log("Send OTP for phone number : ", normalizedPhone);
      // Send OTP using Supabase
      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
      });

      if (error) {
        console.error("Error sending OTP:", error);
        return {
          success: false,
          message: error.message || "Failed to send OTP",
        };
      }

      console.log(`OTP sent to ${normalizedPhone} via Supabase`);

      return {
        success: true,
        message: "OTP sent successfully",
      };
    } catch (error) {
      console.error("Unexpected error sending OTP:", error);
      return {
        success: false,
        message: "An unexpected error occurred while sending OTP",
      };
    }
  },

  async verifyOtp(
    mobileNumber: string,
    otp: string
  ): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // Normalize phone number to E.164 format
      const normalizedPhone = normalizePhoneNumber(mobileNumber);
      const trimmedOtp = otp.trim();

      console.log("Verifying OTP:", {
        phone: normalizedPhone,
        otpLength: trimmedOtp.length,
      });

      // Verify OTP using Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: trimmedOtp,
        type: "sms",
      });

      if (error) {
        console.error("Error verifying OTP:", error);
        return {
          success: false,
          message: error.message || "Invalid OTP",
        };
      }

      if (!data.user || !data.session) {
        console.error("No user or session returned from Supabase");
        return {
          success: false,
          message: "Verification failed - no user data returned",
        };
      }

      const profile = await profileService.fetchProfile(data.user.id)
      const [isDoctorUid, isCorporateUser] = await Promise.all([
        doctorService.isDoctorUid(data.user.id),
        organizationService.isCorporateUser(data.user.id),
      ])

      if (profile?.role === 'worker') {
        await supabase.auth.signOut()
        return {
          success: false,
          message: NOT_CLIENT_MESSAGE,
        }
      }

      if (!canUseClientApp(profile, isDoctorUid, isCorporateUser)) {
        await supabase.auth.signOut()
        return {
          success: false,
          message: profile?.role === 'worker' ? NOT_CLIENT_MESSAGE : NOT_REGISTERED_MESSAGE,
        }
      }

      const user: User = {
        id: data.user.id,
        mobileNumber: data.user.phone || normalizedPhone,
        firstName: profile?.first_name?.trim() || data.user.user_metadata?.firstName || '',
        lastName: profile?.last_name?.trim() || data.user.user_metadata?.lastName || '',
        email: profile?.email ?? data.user.email,
        referralHubAccess: isDoctorUid || isCorporateUser,
      }

      // Save session
      await sessionManager.saveSession(user);

      console.log("OTP verified successfully for user:", user.id);

      return {
        success: true,
        user,
        message: "Login successful",
      };
    } catch (error) {
      console.error("Unexpected error verifying OTP:", error);
      return {
        success: false,
        message: "An unexpected error occurred while verifying OTP",
      };
    }
  },

  async restoreSession(): Promise<User | null> {
    const {
      data: { session: sbSession },
    } = await supabase.auth.getSession()
    if (sbSession?.user) {
      const profile = await profileService.fetchProfile(sbSession.user.id)
      const [isDoctorUid, isCorporateUser] = await Promise.all([
        doctorService.isDoctorUid(sbSession.user.id),
        organizationService.isCorporateUser(sbSession.user.id),
      ])
      if (!canUseClientApp(profile, isDoctorUid, isCorporateUser)) {
        await this.logout()
        return null
      }
      const user: User = {
        id: sbSession.user.id,
        mobileNumber: sbSession.user.phone || sbSession.user.email || '',
        firstName: profile?.first_name?.trim() || sbSession.user.user_metadata?.firstName || '',
        lastName: profile?.last_name?.trim() || sbSession.user.user_metadata?.lastName || '',
        email: profile?.email ?? sbSession.user.email,
        referralHubAccess: isDoctorUid || isCorporateUser,
      }
      await sessionManager.saveSession(user)
      return user
    }

    const session = await sessionManager.getSession()
    if (!session?.user) return null

    const profile = await profileService.fetchProfile(session.user.id)
    const [isDoctorUid, isCorporateUser] = await Promise.all([
      doctorService.isDoctorUid(session.user.id),
      organizationService.isCorporateUser(session.user.id),
    ])
    if (!canUseClientApp(profile, isDoctorUid, isCorporateUser)) {
      await this.logout()
      return null
    }

    const user: User = {
      ...session.user,
      firstName: profile?.first_name?.trim() || session.user.firstName,
      lastName: profile?.last_name?.trim() || session.user.lastName,
      email: profile?.email ?? session.user.email,
      referralHubAccess: isDoctorUid || isCorporateUser,
    }
    await sessionManager.saveSession(user)
    return user
  },

  async logout(): Promise<void> {
    await sessionManager.clearSession();
    await supabase.auth.signOut();
  },
};

import { createContext, useContext, useState, useEffect } from 'react'
import { metadataService } from '../services/metadataService'

const MetadataContext = createContext(undefined)

export function MetadataProvider({ children }) {
  const [services, setServices] = useState([])
  const [appointmentStatuses, setAppointmentStatuses] = useState([])
  const [loading, setLoading] = useState(true)

  const loadMetadata = async () => {
    try {
      setLoading(true)
      const [servicesData, statusesData] = await Promise.all([
        metadataService.fetchServicesMetadata(),
        metadataService.fetchAppointmentStatuses(),
      ])
      setServices(servicesData)
      setAppointmentStatuses(statusesData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetadata()
  }, [])

  return (
    <MetadataContext.Provider
      value={{ services, appointmentStatuses, loading, refreshMetadata: loadMetadata }}
    >
      {children}
    </MetadataContext.Provider>
  )
}

export function useMetadata() {
  const ctx = useContext(MetadataContext)
  if (!ctx) throw new Error('useMetadata must be used within MetadataProvider')
  return ctx
}

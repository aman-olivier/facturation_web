import { getSettings } from './actions'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const initialSettings = await getSettings()
  return <SettingsForm initialSettings={initialSettings} />
}

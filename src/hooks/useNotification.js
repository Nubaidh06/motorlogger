// asks for browser notification permission and fires a notification
export function useNotification() {
  async function notify(message) {
    if (!('Notification' in window)) return

    if (Notification.permission === 'granted') {
      new Notification('MotorLogger', { body: message })
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification('MotorLogger', { body: message })
      }
    }
  }
  return { notify }
}

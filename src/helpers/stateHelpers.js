export const useState = state => {
  const setter = modifiedState => (state = modifiedState)
  const getter = () => state
  return [getter, setter]
}

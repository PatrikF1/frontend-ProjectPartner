export function formatDeadline(deadline) {
  if (!deadline) return '-'
  if (typeof deadline === 'string') {
    return deadline.split('T')[0]
  }
  var date = new Date(deadline)
  return date.toISOString().split('T')[0]
}


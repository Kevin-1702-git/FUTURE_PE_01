export function createReservationReference() {
  return `RSV-${Date.now().toString().slice(-6)}`;
}

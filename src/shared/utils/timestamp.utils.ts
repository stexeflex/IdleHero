export class TimestampUtils {
  public static GetTimestampNow(): number {
    return performance.timeOrigin + performance.now();
  }

  public static GetTimestamp(): number {
    return performance.now();
  }

  public static CurrentTimeToTimestamp(timestampMs: number): string {
    // Date-Objekt aus Millisekunden erstellen
    const date = new Date(timestampMs);

    // Stunden, Minuten und Sekunden extrahieren
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format als [hh:MM:ss]
    return `[${hours}:${minutes}:${seconds}]`;
  }

  public static FormatTimestamp(timestampMs: number): string {
    // Convert milliseconds to seconds
    const totalSeconds = Math.floor(timestampMs / 1000);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format as [MM:ss]
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `[${formattedMinutes}:${formattedSeconds}]`;
  }
}

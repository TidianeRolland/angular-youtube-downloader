import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration',
})
export class FormatDurationPipe implements PipeTransform {
  transform(lengthSeconds: string): string {
    const totalSeconds: number = +lengthSeconds;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor((totalSeconds % 3600) % 60);

    const hours: string =
      h > 0 ? `${h.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:` : '';
    const minutes: string = `${m.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })}`;
    const seconds: string = `${s.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })}`;

    return `${hours}${minutes}:${seconds}`;
  }
}

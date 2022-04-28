import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

export interface VideoInfo {
  title: string;
  thumbnail_url: unknown;
  author: string;
  lengthSeconds: string;
}

export interface VideoDownloadDTO {
  url: string;
  filter: string;
  quality: string;
  title: string;
}

export const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private httpServ: HttpClient) {}

  getYoutubeVideoInfo(videoURL: string): Observable<VideoInfo> {
    const payload = { url: videoURL };
    return this.httpServ
      .post<{ success: boolean; videoInfo: VideoInfo }>(
        `${API_URL}/videoInfo`,
        payload
      )
      .pipe(map((res) => res.videoInfo));
  }

  downloadVideo(videoInfo: VideoDownloadDTO) {
    let params = new HttpParams();
    for (const key in videoInfo) {
      if (Object.prototype.hasOwnProperty.call(videoInfo, key)) {
        const element = videoInfo[key as keyof VideoDownloadDTO];
        params = params.append(key, element);
      }
    }

    return this.httpServ
      .get(`${API_URL}/download`, {
        params: params,
        responseType: 'blob' as 'json',
      })
      .pipe(
        tap((res: any) => {
          const extension = videoInfo.filter === 'audio' ? 'mp3' : 'mp4';
          const filename = `${videoInfo.title}.${extension}`;

          let dataType = res.type;
          let binaryData = [];
          binaryData.push(res);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(
            new Blob(binaryData, { type: dataType })
          );
          if (filename) downloadLink.setAttribute('download', `${filename}`);
          document.body.appendChild(downloadLink);
          downloadLink.click();
        })
      );
  }
}

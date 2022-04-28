import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  share,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  BackendService,
  VideoDownloadDTO,
  VideoInfo,
} from '../backend.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit, AfterViewInit {
  youtubeForm = this.fb.group({
    url: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?(www\\.)?(youtube\\.com|youtu\\.?be)/.+$'
        ),
      ],
    ],
    filter: ['audio'],
  });

  videoInfo$!: Observable<VideoInfo | null>;
  loading$!: Observable<boolean>;
  loadingData$!: Observable<boolean>;
  loadingDownload$!: Observable<boolean>;

  downloadBtnSubject = new Subject<any>();
  downloadBtn$!: Observable<any>;
  downloading$!: Observable<any>;

  errorObject: string = '';

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    const urlField = this.youtubeForm.get('url') as FormControl;
    this.downloadBtn$ = this.downloadBtnSubject.asObservable();

    this.videoInfo$ = urlField.valueChanges
      .pipe(
        filter(() => urlField.valid),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.errorObject = '';
        }),
        switchMap((url: string) =>
          this.backendService.getYoutubeVideoInfo(url).pipe(
            catchError((err) => {
              this.errorObject = `We didn't find this video`;
              return of(null);
            })
          )
        )
      )
      .pipe(share());

    this.downloading$ = this.downloadBtn$.pipe(
      withLatestFrom(this.videoInfo$),
      filter(([_, videoInfo]) => !!videoInfo),
      map(([, videoInfo]) => {
        return {
          ...this.youtubeForm.value,
          title: videoInfo?.title,
          quality: 'high',
        } as VideoDownloadDTO;
      }),
      tap(() => {
        this.errorObject = '';
      }),
      switchMap((videoInfoDTO) =>
        this.backendService.downloadVideo(videoInfoDTO).pipe(
          catchError((err) => {
            this.errorObject = `We coudn't download this video`;
            return of(null);
          })
        )
      )
    );

    this.loadingDownload$ = merge(
      urlField.valueChanges.pipe(map(() => urlField.valid)),
      this.videoInfo$.pipe(mapTo(false)),
      this.downloadBtn$.pipe(mapTo(true)),
      this.downloading$.pipe(mapTo(false))
    );
  }

  ngAfterViewInit(): void {}

  get url() {
    return this.youtubeForm.get('url') as FormControl;
  }

  get filter() {
    return this.youtubeForm.get('filter') as FormControl;
  }
}

declare module 'react-native-sound' {
    export default class Sound {
      constructor(filename: string, basePath: string | null, onError: (error?: any) => void);
  
      isLoaded(): boolean;
      play(onEnd?: () => void): void;
      pause(): void;
      stop(): void;
      release(): void;
      setVolume(value: number): void;
      getDuration(): number;
    }
  }
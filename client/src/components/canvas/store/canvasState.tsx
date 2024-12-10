import { makeAutoObservable } from 'mobx';

class CanvasState {
  canvas: HTMLCanvasElement | null = null;
  sessionid: number | null = null;
  undoList: string[] = [];
  redoList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  setSessionId(id: number) {
    this.sessionid = id;
  }

  pushToUndo(data: string) {
    this.undoList.push(data);
  }

  pushToRedo(data: string) {
    this.redoList.push(data);
  }

  undo() {
    if (this.canvas) {
      const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
      if (this.undoList.length > 0) {
        let dataUrl = this.undoList.pop()!;
        this.redoList.push(this.canvas.toDataURL());
        let img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
          ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
        };
      } else {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }
  redo() {
    if (this.canvas) {
      const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
      if (this.redoList.length > 0) {
        let dataUrl = this.redoList.pop()!;
        this.undoList.push(this.canvas.toDataURL());
        let img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
          ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
        };
      }
    }
  }
}

export default new CanvasState();

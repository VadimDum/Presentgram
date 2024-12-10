import Tool from './Tool';

export default class Rect extends Tool {
  private mouseDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private width: number = 0;
  private height: number = 0;
  private saved: string = '';

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.listen();
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  private mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
  }

  private mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    this.ctx.beginPath();
    const target = e.target as HTMLCanvasElement;
    this.startX = e.pageX - target.getBoundingClientRect().left;
    this.startY = e.pageY - target.getBoundingClientRect().top;
    this.saved = this.canvas.toDataURL();
  }

  private mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      const target = e.target as HTMLCanvasElement;
      const currentX = e.pageX - target.getBoundingClientRect().left;
      const currentY = e.pageY - target.getBoundingClientRect().top;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;
      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  private draw(x: number, y: number, w: number, h: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.rect(x, y, w, h);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }
}

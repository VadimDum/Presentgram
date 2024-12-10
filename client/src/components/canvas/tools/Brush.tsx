import Tool from './Tool';

export default class Brush extends Tool {
  protected mouseDown: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.listen();
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  private mouseUpHandler() {
    this.mouseDown = false;
  }

  private mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    const canvas = e.target as HTMLCanvasElement;
    this.ctx.beginPath();
    this.ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
  }

  private mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      const canvas = e.target as HTMLCanvasElement;
      this.draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    }
  }

  draw(x: number, y: number) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
}

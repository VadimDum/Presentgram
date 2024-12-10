import { makeAutoObservable } from 'mobx';

interface Tool {
  fillColor: string;
  strokeColor: string;
  lineWidth: number;
}

class ToolState {
  tool: Tool | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool: Tool): void {
    this.tool = tool;
  }

  setFillColor(color: string): void {
    if (this.tool) {
      this.tool.fillColor = color;
    }
  }

  setStrokeColor(color: string): void {
    if (this.tool) {
      this.tool.strokeColor = color;
    }
  }

  setLineWidth(width: number): void {
    if (this.tool) {
      this.tool.lineWidth = width;
    }
  }
}

export default new ToolState();

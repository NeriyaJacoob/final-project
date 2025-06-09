const MatrixBackground = () => (
  <iframe
    src="/matrix-binary-canvas.html"
    className="absolute inset-0 w-full h-full z-0"
    style={{
      border: "none",
      pointerEvents: "none",
      background: "transparent"
    }}
    sandbox="allow-same-origin allow-scripts"
    allowTransparency="true"
    title="matrix-background"
  />
);

export default MatrixBackground;

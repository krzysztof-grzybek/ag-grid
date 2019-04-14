// For small data structs like a bounding box, objects are superior to arrays
// in terms of performance (by 3-4% in Chrome 71, Safari 12 and by 20% in Firefox 64).
// They are also self descriptive and harder to abuse.
// For example, one has to do:
// `ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);`
// rather than become enticed by the much slower:
// `ctx.strokeRect(...bbox);`
// https://jsperf.com/array-vs-object-create-access

export type BBox = {
    x: number,
    y: number,
    width: number,
    height: number
}

export function isPointInBBox(bbox: BBox, x: number, y: number) {
    return x >= bbox.x && x <= (bbox.x + bbox.width)
        && y >= bbox.y && y <= (bbox.y + bbox.height);
}

export function renderBBox(params: {
    ctx: CanvasRenderingContext2D,
    bbox: BBox,
    resetTransform?: boolean,
    strokeStyle?: string,
    lineWidth?: number
}) {
    const {ctx, bbox} = params;

    ctx.save();

    if (params.resetTransform) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.strokeStyle = params.strokeStyle || 'red';
    ctx.lineWidth = params.lineWidth || 1;

    ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
    ctx.restore();
}

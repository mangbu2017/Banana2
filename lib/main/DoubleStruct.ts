export interface DoubleStruct<T> {
    pushStack(element: T): void;
    popStack(): T;
    getStackCurrentElement(): T;
    stackSize(): number;
    offerQueue(element: T): void;
    pollQueue(): T;
    getQueueCurrentElement(): T;
    queueSize(): number;
}

export class DoubleStructImpl<T> implements DoubleStruct<T> {
    private readonly stack: Array<T> = [];
    private readonly queue: Array<T> = [];
    constructor() {
    }

    public pushStack(element: T) {
        this.stack.push(element);
    }

    public popStack() {
        return this.stack.pop();
    }

    public stackSize(): number {
        return this.stack.length;
    }

    public getStackCurrentElement(): T {
        const len = this.stackSize();

        return this.stack[len - 1];
    }

    public offerQueue(element: T) {
        this.queue.push(element);
    }

    public pollQueue(): T {
        return this.queue.shift();
    }

    public queueSize(): number {
        return this.queue.length;
    }

    public getQueueCurrentElement(): T {
        const len = this.queueSize();

        return this.queue[len - 1];
    }
}
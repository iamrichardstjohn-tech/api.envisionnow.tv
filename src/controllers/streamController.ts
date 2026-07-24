class StreamController {
    private isStreaming: boolean;

    constructor() {
        this.isStreaming = false;
    }

    startStream(): string {
        if (this.isStreaming) {
            return "Stream is already running.";
        }
        this.isStreaming = true;
        return "Stream started.";
    }

    stopStream(): string {
        if (!this.isStreaming) {
            return "No stream is currently running.";
        }
        this.isStreaming = false;
        return "Stream stopped.";
    }

    getStreamStatus(): string {
        return this.isStreaming ? "Stream is currently running." : "Stream is not running.";
    }
}

export default StreamController;
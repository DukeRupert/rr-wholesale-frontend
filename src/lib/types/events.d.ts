export type ToastEventType = "success" | "warning" |"error"

export interface ToastEventPayload {
	type: ToastEventType;
	title: string;
	description: string;
}

export interface ToastEvent {
	"toast" : ToastEventPayload
}

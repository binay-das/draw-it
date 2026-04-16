import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShapeType } from "../draw";

export interface Shape {
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
}

interface RoomCanvasState {
    shapes: Shape[];
    history: Shape[][];
    historyStep: number;
}

interface CanvasState {
    rooms: Record<string, RoomCanvasState>;

    addShape: (roomId: string, shape: Shape) => void;
    setShapes: (roomId: string, shapes: Shape[]) => void;
    undo: (roomId: string) => void;
    redo: (roomId: string) => void;
    clear: (roomId: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            rooms: {},

            addShape: (roomId: string, shape: Shape) => {
                const { rooms } = get();
                const roomState = rooms[roomId] || { shapes: [], history: [[]], historyStep: 0 };
                const newShapes = [...roomState.shapes, shape];

                const newHistory = roomState.history.slice(0, roomState.historyStep + 1);
                newHistory.push(newShapes);

                set({
                    rooms: {
                        ...rooms,
                        [roomId]: {
                            shapes: newShapes,
                            history: newHistory,
                            historyStep: newHistory.length - 1
                        }
                    }
                });
            },

            setShapes: (roomId: string, shapes: Shape[]) => {
                const { rooms } = get();
                set({
                    rooms: {
                        ...rooms,
                        [roomId]: {
                            shapes,
                            history: [shapes],
                            historyStep: 0
                        }
                    }
                });
            },

            undo: (roomId: string) => {
                const { rooms } = get();
                const roomState = rooms[roomId];
                if (roomState && roomState.historyStep > 0) {
                    const newStep = roomState.historyStep - 1;
                    const restoredShapes = roomState.history[newStep] || [];
                    set({
                        rooms: {
                            ...rooms,
                            [roomId]: {
                                shapes: restoredShapes,
                                history: roomState.history,
                                historyStep: newStep
                            }
                        }
                    });
                }
            },

            redo: (roomId: string) => {
                const { rooms } = get();
                const roomState = rooms[roomId];
                if (roomState && roomState.historyStep < roomState.history.length - 1) {
                    const newStep = roomState.historyStep + 1;
                    const restoredShapes = roomState.history[newStep] || [];
                    set({
                        rooms: {
                            ...rooms,
                            [roomId]: {
                                shapes: restoredShapes,
                                history: roomState.history,
                                historyStep: newStep
                            }
                        }
                    });
                }
            },

            clear: (roomId: string) => {
                const { rooms } = get();
                set({
                    rooms: {
                        ...rooms,
                        [roomId]: {
                            shapes: [],
                            history: [[]],
                            historyStep: 0
                        }
                    }
                });
            }
        }),
        {
            name: "canvas-draw-it",
        }
    )
);

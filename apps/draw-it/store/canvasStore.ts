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

    addShape: (slug: string, shape: Shape) => void;
    setShapes: (slug: string, shapes: Shape[]) => void;
    undo: (slug: string) => void;
    redo: (slug: string) => void;
    clear: (slug: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            rooms: {},

            addShape: (slug: string, shape: Shape) => {
                const { rooms } = get();
                const roomState = rooms[slug] || { shapes: [], history: [[]], historyStep: 0 };
                const newShapes = [...roomState.shapes, shape];

                const newHistory = roomState.history.slice(0, roomState.historyStep + 1);
                newHistory.push(newShapes);

                set({
                    rooms: {
                        ...rooms,
                        [slug]: {
                            shapes: newShapes,
                            history: newHistory,
                            historyStep: newHistory.length - 1
                        }
                    }
                });
            },

            setShapes: (slug: string, shapes: Shape[]) => {
                const { rooms } = get();
                set({
                    rooms: {
                        ...rooms,
                        [slug]: {
                            shapes,
                            history: [shapes],
                            historyStep: 0
                        }
                    }
                });
            },

            undo: (slug: string) => {
                const { rooms } = get();
                const roomState = rooms[slug];
                if (roomState && roomState.historyStep > 0) {
                    const newStep = roomState.historyStep - 1;
                    const restoredShapes = roomState.history[newStep] || [];
                    set({
                        rooms: {
                            ...rooms,
                            [slug]: {
                                shapes: restoredShapes,
                                history: roomState.history,
                                historyStep: newStep
                            }
                        }
                    });
                }
            },

            redo: (slug: string) => {
                const { rooms } = get();
                const roomState = rooms[slug];
                if (roomState && roomState.historyStep < roomState.history.length - 1) {
                    const newStep = roomState.historyStep + 1;
                    const restoredShapes = roomState.history[newStep] || [];
                    set({
                        rooms: {
                            ...rooms,
                            [slug]: {
                                shapes: restoredShapes,
                                history: roomState.history,
                                historyStep: newStep
                            }
                        }
                    });
                }
            },

            clear: (slug: string) => {
                const { rooms } = get();
                set({
                    rooms: {
                        ...rooms,
                        [slug]: {
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

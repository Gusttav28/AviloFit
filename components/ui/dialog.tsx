"use client";
import * as D from "@radix-ui/react-dialog";
export const Dialog=D.Root;export const DialogTrigger=D.Trigger;export const DialogClose=D.Close;
export function DialogContent({children,title}:{children:React.ReactNode;title:string}){return <D.Portal><D.Overlay className="dialog-overlay"/><D.Content className="dialog"><D.Title>{title}</D.Title>{children}</D.Content></D.Portal>}

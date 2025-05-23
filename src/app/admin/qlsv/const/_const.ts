export const ModalType = ['create', 'view', 'edit'] as const

export type TModalType = (typeof ModalType)[number]

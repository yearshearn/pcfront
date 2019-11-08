import checkPermission from '@/utils/permission'

export const editRoleFlag = () => checkPermission(['内勤', '责任人'])

export const canEvaluationFlag = () => checkPermission(['责任人'])


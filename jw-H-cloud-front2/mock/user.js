// import { param2Obj } from './utils'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    roleGroups: [{ groupId: '1', groupName: 'admin' }],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    userName: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    roleGroups: [],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    userName: 'Normal Editor'
  }
}

export default {
  login: res => {
    // const { username } = JSON.parse(res.body)
    const data = tokens['admin']

    if (data) {
      return {
        code: 0,
        data
      }
    }
    return {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  },
  getInfo: res => {
    // console.log(res.url)
    // const r = param2Obj(res.url)
    // const { token } = r
    const info = users['admin-token']
    // const info = users['editor-token']

    if (info) {
      return {
        code: 0,
        data: info
      }
    }
    return {
      code: 50008,
      message: 'Login failed, unable to get user details.'
    }
  },
  logout: () => {
    return {
      code: 0,
      data: 'success'
    }
  }
}



module.exports = {
    routes: [
      { 
        method: 'GET',
        path: '/me',
        handler: 'event.me',
        config:{
            policies:[]
        }
      }
    ]
  }
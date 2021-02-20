const app = new Vue({
  el: '#app',
  data: {
    title: 'NestJS Chat Real Time',
    name: '',
    text: '',
    selected: 'general',
    messages: [],
    socket: null,
    activeRoom: '',
    rooms: {
      general: false,
      roomA: false,
      roomB: false,
      roomC: false,
      roomD: false,
    },
    listRooms: ['general', 'roomA', 'roomB', 'roomC', 'roomD'],
  },
  methods: {
    onChange(event) {
      this.socket.emit('LEAVE_BOARD', this.activeRoom);
      this.activeRoom = event.target.value;
      this.socket.emit('JOIN_BOARD', this.activeRoom);
    },

    sendMessage() {
      if (this.validateInput()) {
        const message = {
          name: this.name,
          text: this.text,
          room: this.activeRoom,
        };
        this.socket.emit('msgToServer', message);
        this.text = '';
      }
    },
    receivedMessage(message) {
      this.messages.push(message);
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0;
    },
    check() {
      if (this.isMemberOfActiveRoom) {
        this.socket.emit('LEAVE_BOARD', this.activeRoom);
      } else {
        this.socket.emit('JOIN_BOARD', this.activeRoom);
      }
    },
  },
  computed: {
    isMemberOfActiveRoom() {
      return this.rooms[this.activeRoom];
    },
  },
  created() {
    this.activeRoom = this.selected;
    this.socket = io('ws://localhost:4000/board');
    this.socket.on('msgToClient', message => {
      console.log(message);
      this.receivedMessage(message);
    });

    this.socket.on('connect', () => {
      alert(123);
      this.check();
    });

    this.socket.on('CREATED_LIST', newList => {
      console.log('newList', newList);
    });

    this.socket.on('JOINED_BOARD', room => {
      this.rooms[room] = true;
    });

    this.socket.on('LEFT_BOARD', room => {
      this.rooms[room] = false;
    });
  },
});

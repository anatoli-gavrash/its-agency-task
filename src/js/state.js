// Конструктор хранилища с подпиской на изменение состояния
export class State {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  subscribe(newListener) {
    this.listeners.push(newListener);

    return () => {
      this.listeners.filter((listener) => listener !== newListener);
    };
  }
  
  get() {
    return this.state;
  }
  
  set(newState) {
    this.state = newState;
    
    for (const listener of this.listeners) {
      listener();
    }
  }
}

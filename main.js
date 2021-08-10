const currentUser = {
  isOnline: false,
  value: "",
};

function get(id) {
  return document.getElementById(id);
}

function show(id) {
  get(id).style.display = "block";
}

function hide(id) {
  get(id).style.display = "none";
}

function set(id, value) {
    get(id).textContent = value;
}

function loginWithUsername() {
  const { value } = get("username");
  currentUser.isOnline = true;
  currentUser.value = value;

  hide("start-stage");
  show("setup-stage");
  set('userId', value) 
  // return false to preventDefault;
  return false;
}

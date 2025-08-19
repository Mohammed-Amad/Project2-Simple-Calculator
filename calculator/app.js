
const display = document.getElementById("display");
const errorEl = document.getElementById("error");


const ops = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => (b === 0 ? NaN : a / b),
};


const calc = {
  a: "0",   
  b: "",    
  op: null, 
  show(text) { display.textContent = text; },
  setError(msg = "") { errorEl.textContent = msg; },

  currentStr() { return this.op ? (this.b || "0") : this.a; },
  update() { this.show(this.currentStr()); },

  clearAll() {
    this.a = "0";
    this.b = "";
    this.op = null;
    this.setError("");
    this.update();
  },

  delOne() {
    let s = this.op ? (this.b || "") : this.a;
    s = s.length <= 1 ? "0" : s.slice(0, -1);
    if (this.op) this.b = s === "0" ? "" : s;
    else this.a = s;
    this.update();
  },

  addDigit(ch) {
    this.setError("");
    if (this.op) this.b = (this.b === "0" ? "" : this.b) + ch;
    else this.a = (this.a === "0" ? "" : this.a) + ch;
    this.update();
  },

  addDot() {
    this.setError("");
    if (this.op) {
      if (!this.b) this.b = "0";
      if (!this.b.includes(".")) this.b += ".";
    } else {
      if (!this.a.includes(".")) this.a += ".";
    }
    this.update();
  },

  setOp(op) {
    this.setError("");
    if (this.op && this.b) this.equals(); 
    this.op = op;
    this.update();
  },

  equals() {
    if (!this.op || this.b === "" || this.b === ".") return;
    const x = parseFloat(this.a);
    const y = parseFloat(this.b);
    const result = ops[this.op](x, y);

    if (Number.isNaN(result)) {
      this.setError("Error: Division by zero");
      return;
    }

    this.a = String(result);
    this.b = "";
    this.op = null;
    this.setError("");
    this.update();
  },
};


document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num !== undefined) {
    const v = btn.dataset.num;
    v === "." ? calc.addDot() : calc.addDigit(v);
  }
  if (btn.dataset.op) calc.setOp(btn.dataset.op);

  if (btn.dataset.action === "clear")  calc.clearAll();
  if (btn.dataset.action === "del")    calc.delOne();
  if (btn.dataset.action === "equals") calc.equals();
});


calc.update();

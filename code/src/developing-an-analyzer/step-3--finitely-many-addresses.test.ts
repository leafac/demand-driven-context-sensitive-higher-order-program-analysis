import { evaluate } from "./step-3--finitely-many-addresses";

describe("run()", () => {
  test("§ An Expression That Already Is a Value", () => {
    expect(evaluate("x => x")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"x => x\\",
            \\"environment\\": []
          }
        ],
        \\"store\\": []
      }"
    `);
  });

  test("§ A Call Involving Immediate Functions", () => {
    expect(evaluate("(x => x)(y => y)")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"y => y\\",
            \\"environment\\": []
          }
        ],
        \\"store\\": [
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ Substitution in Function Definitions", () => {
    expect(evaluate("(x => z => x)(y => y)")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"z => x\\",
            \\"environment\\": [
              [
                \\"x\\",
                \\"x\\"
              ]
            ]
          }
        ],
        \\"store\\": [
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ Name Mismatch", () => {
    expect(evaluate("(x => z => z)(y => y)")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"z => z\\",
            \\"environment\\": [
              [
                \\"x\\",
                \\"x\\"
              ]
            ]
          }
        ],
        \\"store\\": [
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ Name Reuse", () => {
    expect(evaluate("(x => x => x)(y => y)")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"x => x\\",
            \\"environment\\": [
              [
                \\"x\\",
                \\"x\\"
              ]
            ]
          }
        ],
        \\"store\\": [
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
    expect(evaluate("(x => x => z => x)(a => a)(y => y)"))
      .toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"z => x\\",
            \\"environment\\": [
              [
                \\"x\\",
                \\"x\\"
              ]
            ]
          }
        ],
        \\"store\\": [
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"a => a\\",
                \\"environment\\": []
              }
            ]
          ],
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ Substitution in Function Calls", () => {
    expect(evaluate("(x => z => x(x))(y => y)")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"z => x(x)\\",
            \\"environment\\": [
              [
                \\"x\\",
                \\"x\\"
              ]
            ]
          }
        ],
        \\"store\\": [
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ An Argument That Is Not Immediate", () => {
    expect(evaluate("(x => z => x)((a => a)(y => y))")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"z => x\\",
            \\"environment\\": [
              [
                \\"x\\",
                \\"x\\"
              ]
            ]
          }
        ],
        \\"store\\": [
          [
            \\"a\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ],
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ A Function That Is Not Immediate", () => {
    expect(evaluate("((z => z)(x => x))(y => y)")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"y => y\\",
            \\"environment\\": []
          }
        ],
        \\"store\\": [
          [
            \\"z\\",
            [
              {
                \\"function\\": \\"x => x\\",
                \\"environment\\": []
              }
            ]
          ],
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ Continuing to Run After a Function Call", () => {
    expect(evaluate("(x => (z => z)(x))(y => y)")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"y => y\\",
            \\"environment\\": []
          }
        ],
        \\"store\\": [
          [
            \\"x\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ],
          [
            \\"z\\",
            [
              {
                \\"function\\": \\"y => y\\",
                \\"environment\\": []
              }
            ]
          ]
        ]
      }"
    `);
  });

  test("§ A Reference to an Undefined Variable", () => {
    expect(() => {
      evaluate("(x => y)(y => y)");
    }).toThrowErrorMatchingInlineSnapshot(
      `"Reference to undefined variable: y"`
    );
    expect(evaluate("x => y")).toMatchInlineSnapshot(`
      "{
        \\"value\\": [
          {
            \\"function\\": \\"x => y\\",
            \\"environment\\": []
          }
        ],
        \\"store\\": []
      }"
    `);
  });
});

describe("parse()", () => {
  test("Syntax error", () => {
    expect(() => {
      evaluate("x =>");
    }).toThrowErrorMatchingInlineSnapshot(`"Line 1: Unexpected end of input"`);
  });

  test("Program with multiple statements", () => {
    expect(() => {
      evaluate("x => x; y => y");
    }).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported Yocto-JavaScript feature: Program with multiple statements"`
    );
  });

  test("Function of multiple parameters", () => {
    expect(() => {
      evaluate("(x, y) => x");
    }).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported Yocto-JavaScript feature: SequenceExpression"`
    );
  });

  test("Function with parameter that is a pattern", () => {
    expect(() => {
      evaluate("([x, y]) => x");
    }).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported Yocto-JavaScript feature: ArrayExpression"`
    );
  });

  test("Call with multiple arguments", () => {
    expect(() => {
      evaluate("f(a, b)");
    }).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported Yocto-JavaScript feature: CallExpression with multiple arguments"`
    );
  });

  test("Number", () => {
    expect(() => {
      evaluate("29");
    }).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported Yocto-JavaScript feature: Literal"`
    );
  });

  test("Variable declaration", () => {
    expect(() => {
      evaluate("const f = x => x");
    }).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported Yocto-JavaScript feature: VariableDeclarator"`
    );
  });
});

test("§ Programs That Do Not Terminate", () => {
  expect(() => {
    evaluate("(f => f(f))(f => f(f))");
  }).toThrowErrorMatchingInlineSnapshot(`"Maximum call stack size exceeded"`);
  expect(() => {
    evaluate("(f => (f(f))(f(f)))(f => (f(f))(f(f)))");
  }).toThrowErrorMatchingInlineSnapshot(`"Maximum call stack size exceeded"`);
  expect(() => {
    evaluate("(f => c => f(f)(x => c))(f => c => f(f)(x => c))(y => y)");
  }).toThrowErrorMatchingInlineSnapshot(`"Maximum call stack size exceeded"`);
});

test("§ A Function Body Is Evaluated with the Environment in Its Closure", () => {
  expect(evaluate("(f => (x => f(x))(a => a))((x => z => x)(y => y))"))
    .toMatchInlineSnapshot(`
    "{
      \\"value\\": [
        {
          \\"function\\": \\"y => y\\",
          \\"environment\\": []
        }
      ],
      \\"store\\": [
        [
          \\"x\\",
          [
            {
              \\"function\\": \\"y => y\\",
              \\"environment\\": []
            }
          ]
        ],
        [
          \\"f\\",
          [
            {
              \\"function\\": \\"z => x\\",
              \\"environment\\": [
                [
                  \\"x\\",
                  \\"x\\"
                ]
              ]
            }
          ]
        ],
        [
          \\"x\\",
          [
            {
              \\"function\\": \\"a => a\\",
              \\"environment\\": [
                [
                  \\"f\\",
                  \\"f\\"
                ]
              ]
            }
          ]
        ],
        [
          \\"z\\",
          [
            {
              \\"function\\": \\"a => a\\",
              \\"environment\\": [
                [
                  \\"f\\",
                  \\"f\\"
                ]
              ]
            }
          ]
        ]
      ]
    }"
  `);
});
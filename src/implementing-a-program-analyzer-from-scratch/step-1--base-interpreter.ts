import { Expression, Identifier, Value } from "../languages/yocto-javascript";

export function evaluate(expression: Expression): Value {
  switch (expression.type) {
    case "ArrowFunctionExpression":
      return expression;
    case "CallExpression":
      const {
        params: [param],
        body
      } = evaluate(expression.callee);
      const argument = evaluate(expression.arguments[0]);
      return evaluate(substitute(param, body, argument));
    case "Identifier":
      throw new EvalError(
        `Identifier ${expression.name} not in scope (this should never happen because the scope is checked when constructing the program)`
      );
  }
}

function substitute(
  param: Identifier,
  body: Expression,
  argument: Value
): Expression {
  return traverse(body);

  function traverse(expression: Expression): Expression {
    switch (expression.type) {
      case "ArrowFunctionExpression":
        return expression.params[0].name === param.name
          ? expression
          : { ...expression, body: traverse(expression.body) };
      case "CallExpression":
        return {
          ...expression,
          callee: traverse(expression.callee),
          arguments: [traverse(expression.arguments[0])]
        };
      case "Identifier":
        return expression.name === param.name ? argument : expression;
    }
  }
}
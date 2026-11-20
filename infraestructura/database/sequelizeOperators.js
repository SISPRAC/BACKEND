
// Compatibilidad de operadores para Sequelize 3.30.0
const Op = Object.freeze({
    ne: "$ne",
    in: "$in",
    notIn: "$notIn",
    lt: "$lt",
    or: "$or"
});

export { Op };

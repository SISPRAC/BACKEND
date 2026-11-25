import SequelizePackage from "sequelize";
const { DataTypes } = SequelizePackage;

const createPeriodoRespaldoModel = (sequelize) => {
    const PeriodoRespaldo = sequelize.define(
        "PeriodoRespaldos",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            periodo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: "Periodos", key: "id" },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },

            // ---------- SUBIDA ----------
            estado_subida: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: "PENDIENTE",
                validate: { isIn: [["PENDIENTE", "SUBIDO", "FALLO"]] },
            },
            fecha_subida: { type: DataTypes.DATE, allowNull: true },
            error_subida: { type: DataTypes.TEXT, allowNull: true },
            intentos_subida: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            drive_folder_id: { type: DataTypes.STRING(100), allowNull: true },
            drive_folder_url: { type: DataTypes.TEXT, allowNull: true },

            // ---------- COMPRESIÓN ----------
            estado_compresion: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: "SIN_COMPRIMIR",
                validate: { isIn: [["SIN_COMPRIMIR", "COMPRIMIDO", "FALLO"]] },
            },
            fecha_compresion: { type: DataTypes.DATE, allowNull: true },
            error_compresion: { type: DataTypes.TEXT, allowNull: true },
            intentos_compresion: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            drive_zip_id: { type: DataTypes.STRING(100), allowNull: true },
            drive_zip_url: { type: DataTypes.TEXT, allowNull: true },

            // ---------- LIBERACIÓN DE ESPACIO LOCAL ----------
            local_liberado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            fecha_liberacion_local: { type: DataTypes.DATE, allowNull: true },
            archivos_liberados_local: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            mb_liberados_local: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            intentos_liberacion: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            error_liberacion: { type: DataTypes.TEXT, allowNull: true },
        },
        {
            tableName: "PeriodoRespaldos",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return PeriodoRespaldo;
};

export default createPeriodoRespaldoModel;

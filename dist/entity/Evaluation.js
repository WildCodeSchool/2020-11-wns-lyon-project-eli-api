"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluation = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("./User");
const Upload_1 = require("./Upload");
const Speciality_1 = require("./Speciality");
let Evaluation = class Evaluation extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Evaluation.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ nullable: false }),
    typeorm_1.Column({ type: 'varchar', length: 120 }),
    class_validator_1.Length(2, 120, {
        message: 'The title must be at least 2 but not longer than 120 characters',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 120, nullable: true }),
    class_validator_1.IsOptional(),
    class_validator_1.Length(2, 120, {
        message: 'The title must be at least 1 but not longer than 120 characters',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "subtitle", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Evaluation.prototype, "content", void 0);
__decorate([
    type_graphql_1.Field({ nullable: false }),
    typeorm_1.Column({ type: 'tinyint', default: false }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], Evaluation.prototype, "is_auto", void 0);
__decorate([
    type_graphql_1.Field({ nullable: false }),
    typeorm_1.Column({ type: 'tinyint', default: false }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], Evaluation.prototype, "is_official", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'smallint', nullable: true }),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], Evaluation.prototype, "max_grade", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Upload_1.Upload),
    typeorm_1.JoinTable({ name: 'evaluation_has_uploads' }),
    __metadata("design:type", Array)
], Evaluation.prototype, "uploads", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.teacher_evaluations, {
        nullable: false,
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Speciality_1.Speciality),
    typeorm_1.JoinTable({ name: 'evaluation_has_specialities' }),
    __metadata("design:type", Array)
], Evaluation.prototype, "specialities", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Evaluation.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Evaluation.prototype, "updatedAt", void 0);
Evaluation = __decorate([
    type_graphql_1.ObjectType('Evaluation'),
    type_graphql_1.InputType('EvaluationInput'),
    typeorm_1.Entity()
], Evaluation);
exports.Evaluation = Evaluation;

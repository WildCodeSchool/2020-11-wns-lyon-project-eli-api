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
exports.Course = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("./User");
const Upload_1 = require("./Upload");
const Evaluation_1 = require("./Evaluation");
const Speciality_1 = require("./Speciality");
let Course = class Course extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Course.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ nullable: false }),
    typeorm_1.Column({ type: 'varchar', length: 120 }),
    class_validator_1.Length(2, 120, {
        message: 'The title must be at least 2 but not longer than 120 characters',
    }),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 120, nullable: true }),
    class_validator_1.Length(1, 120, {
        message: 'The subtitle must be at least 1 but not longer than 120 characters',
    }),
    __metadata("design:type", String)
], Course.prototype, "subtitle", void 0);
__decorate([
    type_graphql_1.Field(() => String, { defaultValue: null }),
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Course.prototype, "content", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Course.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.courses, { nullable: false }),
    __metadata("design:type", Number)
], Course.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Upload_1.Upload),
    typeorm_1.JoinTable({ name: 'course_has_uploads' }),
    __metadata("design:type", Array)
], Course.prototype, "uploads", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Evaluation_1.Evaluation),
    typeorm_1.JoinTable({ name: 'courses_has_evaluations' }),
    __metadata("design:type", Array)
], Course.prototype, "evaluations", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Speciality_1.Speciality),
    typeorm_1.JoinTable({ name: 'courses_has_specialities' }),
    __metadata("design:type", Array)
], Course.prototype, "specialities", void 0);
Course = __decorate([
    type_graphql_1.ObjectType('Course'),
    type_graphql_1.InputType('CourseInput'),
    typeorm_1.Entity()
], Course);
exports.Course = Course;

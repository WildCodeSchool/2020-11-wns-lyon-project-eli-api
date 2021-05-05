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
exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Course_1 = require("./Course");
const Promotion_1 = require("./Promotion");
const Speciality_1 = require("./Speciality");
const Evaluation_1 = require("./Evaluation");
const ContactInformation_1 = require("./ContactInformation");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true, type: 'varchar', length: 50 }),
    class_validator_1.IsEmail({}, { message: 'Incorrect email' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 255 }),
    class_validator_1.Length(6, 30, {
        message: 'The password must be at least 6 but not longer than 30 characters',
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 35 }),
    class_validator_1.IsNotEmpty({ message: 'The firstname is required' }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 35 }),
    class_validator_1.IsNotEmpty({ message: 'The lastname is required' }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 11 }),
    class_validator_1.IsNotEmpty({ message: 'The role is required' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToOne(() => ContactInformation_1.ContactInformation),
    typeorm_1.JoinColumn(),
    __metadata("design:type", ContactInformation_1.ContactInformation)
], User.prototype, "contact_informations", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Promotion_1.Promotion, (promotion) => promotion.users),
    __metadata("design:type", Number)
], User.prototype, "promotion", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Evaluation_1.Evaluation),
    typeorm_1.JoinTable({ name: 'student_has_evaluations' }),
    __metadata("design:type", Array)
], User.prototype, "student_evaluations", void 0);
__decorate([
    typeorm_1.OneToMany(() => Course_1.Course, (course) => course.user),
    __metadata("design:type", Array)
], User.prototype, "courses", void 0);
__decorate([
    typeorm_1.OneToMany(() => Evaluation_1.Evaluation, (evaluation) => evaluation.user),
    __metadata("design:type", Array)
], User.prototype, "teacher_evaluations", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Promotion_1.Promotion),
    typeorm_1.JoinTable({ name: 'teacher_has_promotions' }),
    __metadata("design:type", Array)
], User.prototype, "promotions", void 0);
__decorate([
    type_graphql_1.Authorized('TEACHER'),
    typeorm_1.ManyToMany(() => Speciality_1.Speciality),
    typeorm_1.JoinTable({ name: 'teacher_has_specialities' }),
    __metadata("design:type", Array)
], User.prototype, "specialities", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    type_graphql_1.ObjectType('User'),
    type_graphql_1.InputType('UserInput'),
    typeorm_1.Entity()
], User);
exports.User = User;

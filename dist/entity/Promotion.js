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
exports.Promotion = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("./User");
const Course_1 = require("./Course");
let Promotion = class Promotion extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Promotion.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 70 }),
    class_validator_1.Length(1, 70, {
        message: 'The promotion must be at least 1 but not longer than 70 characters',
    }),
    __metadata("design:type", String)
], Promotion.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => User_1.User, (user) => user.promotion),
    __metadata("design:type", Array)
], Promotion.prototype, "users", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Course_1.Course),
    typeorm_1.JoinTable({ name: 'promotion_has_courses' }),
    __metadata("design:type", Array)
], Promotion.prototype, "courses", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Promotion.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Promotion.prototype, "updatedAt", void 0);
Promotion = __decorate([
    type_graphql_1.ObjectType('Promotion'),
    type_graphql_1.InputType('PromotionInput'),
    typeorm_1.Entity()
], Promotion);
exports.Promotion = Promotion;

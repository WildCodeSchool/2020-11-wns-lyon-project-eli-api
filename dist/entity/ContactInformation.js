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
exports.ContactInformation = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let ContactInformation = class ContactInformation extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ContactInformation.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 35 }),
    class_validator_1.IsAlphanumeric(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ContactInformation.prototype, "adress_1", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 35 }),
    class_validator_1.IsAlphanumeric(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], ContactInformation.prototype, "adress_2", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 35 }),
    class_validator_1.IsAlphanumeric(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], ContactInformation.prototype, "adress_3", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 35 }),
    class_validator_1.IsAlpha(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ContactInformation.prototype, "city", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar', length: 70 }),
    class_validator_1.IsAlpha(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ContactInformation.prototype, "country", void 0);
ContactInformation = __decorate([
    type_graphql_1.ObjectType('ContactInformation'),
    type_graphql_1.InputType('ContactInformationInput'),
    typeorm_1.Entity()
], ContactInformation);
exports.ContactInformation = ContactInformation;

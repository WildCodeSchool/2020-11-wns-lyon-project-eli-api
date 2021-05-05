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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Course_1 = require("../entity/Course");
const typeorm_1 = require("typeorm");
let CourseResolver = class CourseResolver {
    constructor() {
        this.courseRepo = typeorm_1.getRepository(Course_1.Course);
    }
    async getCourses() {
        return await this.courseRepo.find();
    }
    async getCourse(id) {
        return await this.courseRepo.findOne({ where: { id } });
    }
    async createCourse(values, ctx) {
        const user = ctx.user;
        const newCourse = this.courseRepo.create({
            ...values,
            user,
        });
        return await this.courseRepo
            .save(newCourse)
            .catch((e) => console.log('course save error', e));
    }
    async updateCourse(id, values, ctx) {
        const course = await this.courseRepo.findOne({
            where: { id, user: ctx.user },
        });
        if (!course) {
            throw new Error("Course not found or you're not authorize to update the course !");
        }
        const updatedCourse = Object.assign(course, values);
        return await this.courseRepo.save(updatedCourse);
    }
    async deleteCourse(id) {
        const course = await this.courseRepo.findOne({ where: { id } });
        if (!course) {
            throw new Error('Course not found !');
        }
        try {
            await this.courseRepo.remove(course);
            return true;
        }
        catch (err) {
            throw new Error('you are not allowed to delete this course');
        }
    }
};
__decorate([
    type_graphql_1.Query(() => [Course_1.Course]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "getCourses", null);
__decorate([
    type_graphql_1.Query(() => Course_1.Course),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "getCourse", null);
__decorate([
    type_graphql_1.Authorized('TEACHER'),
    type_graphql_1.Mutation(() => Course_1.Course),
    __param(0, type_graphql_1.Arg('values', () => Course_1.Course)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Course_1.Course, Object]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "createCourse", null);
__decorate([
    type_graphql_1.Authorized('TEACHER'),
    type_graphql_1.Mutation(() => Course_1.Course),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Arg('values')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Course_1.Course, Object]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "updateCourse", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "deleteCourse", null);
CourseResolver = __decorate([
    type_graphql_1.Resolver(Course_1.Course)
], CourseResolver);
exports.CourseResolver = CourseResolver;

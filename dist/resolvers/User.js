"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const AuthResult_1 = require("../entity/AuthResult");
const User_1 = require("../entity/User");
const bcrypt = __importStar(require("bcrypt"));
const helpers_1 = require("../utils/helpers");
const typeorm_1 = require("typeorm");
let UserResolver = UserResolver_1 = class UserResolver {
    constructor() {
        this.userRepo = typeorm_1.getRepository(User_1.User);
    }
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    async authenticatedUser(ctx) {
        console.log();
        return ctx.user;
    }
    // @Query(() => User)
    //@Authorized()
    // public async getUser(@Ctx() ctx): Promise<User> {
    //     console.log(ctx.user)
    //     return ctx.user;
    // }
    async authenticate(email, password
    // @Ctx() ctx
    ) {
        const user = await this.userRepo.findOneOrFail({ email });
        if (user && (await bcrypt.compare(password, user.password)) === true) {
            const token = helpers_1.generateJwt({
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            });
            return { token, user };
        }
        else {
            return {};
        }
    }
    async createUser(values) {
        const hash = await UserResolver_1.hashPassword(values.password);
        const user = this.userRepo.create({ ...values, password: hash });
        return await this.userRepo
            .save(user)
            .catch((err) => console.log('save error', err));
    }
    async updateUser(id, values
    // @Ctx() ctx
    ) {
        const user = await this.userRepo.findOne({
            where: { id: id },
        });
        console.log('updateUser', user);
        if (!user) {
            throw new Error("User not found or you're not authorize to update them !");
        }
        const updatedUser = Object.assign(user, values);
        return await this.userRepo.save(updatedUser);
    }
    async deleteUser(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found !');
        }
        try {
            await this.userRepo.remove(user);
            return true;
        }
        catch (err) {
            throw new Error('you are not allowed to delete this user');
        }
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "authenticatedUser", null);
__decorate([
    type_graphql_1.Mutation(() => AuthResult_1.AuthResult, { nullable: true }),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "authenticate", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Arg('values', () => User_1.User)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Arg('values')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, User_1.User
        // @Ctx() ctx
    ]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
UserResolver = UserResolver_1 = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;

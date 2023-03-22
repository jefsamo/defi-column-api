"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generic_model_1 = __importDefault(require("@/resources/generic/generic.model"));
const catchAsync_1 = __importDefault(require("@/utils/exceptions/catchAsync"));
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
const APIFeatures_1 = __importDefault(require("@/utils/APIFeatures"));
const generic_service_1 = __importDefault(require("@/resources/generic/generic.service"));
const mongoose_1 = require("mongoose");
class GenericController {
    constructor() {
        this.path = "/posts";
        this.router = (0, express_1.Router)();
        this.GenericService = new generic_service_1.default();
        // initialise Generic Model
        this.generic = generic_model_1.default;
        this.getAllDocs = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const features = new APIFeatures_1.default(this.generic.find(), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const generics = yield features.query;
            return res.status(200).json({
                status: "success",
                result: generics.length,
                data: {
                    generics,
                },
            });
        }));
        this.createDoc = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const generic = yield this.GenericService.createPost(req.body);
            return res.status(201).json({
                status: "success",
                data: {
                    generic,
                },
            });
        }));
        this.getDoc = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const generic = yield this.GenericService.findPostById(id);
            if (!generic) {
                return next(new HttpException_1.default("No doc with this ID", 404));
            }
            return res.status(200).json({
                status: "success",
                data: {
                    generic,
                },
            });
        }));
        this.updateDoc = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const generic = yield this.generic.findByIdAndUpdate(req.params.id, req.body, {
                runValidators: true,
                returnOriginal: false,
            });
            if (!generic) {
                return next(new HttpException_1.default("No doc with this ID", 404));
            }
            return res.status(200).json({
                status: "success",
                data: {
                    generic,
                },
            });
        }));
        this.deleteDoc = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            yield this.GenericService.deletePostById(id);
            return res.status(204).json({
                status: "success",
            });
        }));
        this.initialiseRoutes();
    }
    // Routes handlers
    initialiseRoutes() {
        this.router.route(`${this.path}`).get(this.getAllDocs).post(this.createDoc);
        this.router
            .route(`${this.path}/:id`)
            .get(this.getDoc)
            .patch(this.updateDoc)
            .delete(this.deleteDoc);
    }
}
exports.default = GenericController;

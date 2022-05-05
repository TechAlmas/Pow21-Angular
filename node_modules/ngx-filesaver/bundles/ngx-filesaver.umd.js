(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('file-saver'), require('@angular/common/http'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('ngxFileSaver', ['exports', '@angular/core', 'file-saver', '@angular/common/http', 'rxjs'], factory) :
    (global = global || self, factory(global.ngxFileSaver = {}, global.ng.core, global.saveAs, global.ng.common.http, global.rxjs));
}(this, function (exports, core, fileSaver, http, rxjs) { 'use strict';

    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var FileSaverService = /** @class */ (function () {
        function FileSaverService() {
        }
        Object.defineProperty(FileSaverService.prototype, "isFileSaverSupported", {
            get: function () {
                try {
                    return !!new Blob();
                }
                catch (e) {
                    return false;
                }
            },
            enumerable: true,
            configurable: true
        });
        FileSaverService.prototype.genType = function (fileName) {
            if (!fileName || fileName.lastIndexOf('.') === -1) {
                return 'text/plain';
            }
            var type = fileName.substr(fileName.lastIndexOf('.') + 1);
            switch (type) {
                case 'txt':
                    return 'text/plain';
                case 'xml':
                case 'html':
                    return "text/" + type;
                case 'json':
                    return 'octet/stream';
                default:
                    return "application/" + type;
            }
        };
        FileSaverService.prototype.save = function (blob, fileName, filtType, option) {
            if (!blob) {
                throw new Error('Data argument should be a blob instance');
            }
            var file = new Blob([blob], { type: filtType || blob.type || this.genType(fileName) });
            fileSaver.saveAs(file, decodeURI(fileName || 'download'), option);
        };
        FileSaverService.prototype.saveText = function (txt, fileName, option) {
            var blob = new Blob([txt]);
            this.save(blob, fileName, null, option);
        };
        FileSaverService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function FileSaverService_Factory() { return new FileSaverService(); }, token: FileSaverService, providedIn: "root" });
        FileSaverService = __decorate([
            core.Injectable({ providedIn: 'root' })
        ], FileSaverService);
        return FileSaverService;
    }());

    var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var FileSaverDirective = /** @class */ (function () {
        function FileSaverDirective(el, fss, httpClient) {
            this.el = el;
            this.fss = fss;
            this.httpClient = httpClient;
            this.method = 'GET';
            this.success = new core.EventEmitter();
            this.error = new core.EventEmitter();
            if (!fss.isFileSaverSupported) {
                el.nativeElement.classList.add("filesaver__not-support");
            }
        }
        FileSaverDirective.prototype.getName = function (res) {
            return decodeURI(this.fileName || res.headers.get('filename') || res.headers.get('x-filename'));
        };
        FileSaverDirective.prototype._click = function () {
            var _this = this;
            if (!this.fss.isFileSaverSupported) {
                return;
            }
            var req = this.http;
            if (!req) {
                var params = new http.HttpParams();
                var query = this.query || {};
                // tslint:disable-next-line:forin
                for (var item in query) {
                    params.set(item, query[item]);
                }
                req = this.httpClient.request(this.method, this.url, {
                    observe: 'response',
                    responseType: 'blob',
                    headers: this.header,
                    params: params,
                });
            }
            this.setDisabled(true);
            req.subscribe(function (res) {
                if (res.status !== 200 || res.body.size <= 0) {
                    _this.error.emit(res);
                    return;
                }
                _this.fss.save(res.body, _this.getName(res), null, _this.fsOptions);
                _this.success.emit(res);
            }, function (err) { return _this.error.emit(err); }, function () { return _this.setDisabled(false); });
        };
        FileSaverDirective.prototype.setDisabled = function (status) {
            var el = this.el.nativeElement;
            el.disabled = status;
            el.classList[status ? 'add' : 'remove']("filesaver__disabled");
        };
        FileSaverDirective.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: FileSaverService },
            { type: http.HttpClient }
        ]; };
        __decorate$1([
            core.Input(),
            __metadata("design:type", Object)
        ], FileSaverDirective.prototype, "method", void 0);
        __decorate$1([
            core.Input(),
            __metadata("design:type", rxjs.Observable)
        ], FileSaverDirective.prototype, "http", void 0);
        __decorate$1([
            core.Input(),
            __metadata("design:type", Object)
        ], FileSaverDirective.prototype, "query", void 0);
        __decorate$1([
            core.Input(),
            __metadata("design:type", Object)
        ], FileSaverDirective.prototype, "header", void 0);
        __decorate$1([
            core.Input(),
            __metadata("design:type", String)
        ], FileSaverDirective.prototype, "url", void 0);
        __decorate$1([
            core.Input(),
            __metadata("design:type", String)
        ], FileSaverDirective.prototype, "fileName", void 0);
        __decorate$1([
            core.Input(),
            __metadata("design:type", Object)
        ], FileSaverDirective.prototype, "fsOptions", void 0);
        __decorate$1([
            core.Output(),
            __metadata("design:type", Object)
        ], FileSaverDirective.prototype, "success", void 0);
        __decorate$1([
            core.Output(),
            __metadata("design:type", Object)
        ], FileSaverDirective.prototype, "error", void 0);
        __decorate$1([
            core.HostListener('click'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], FileSaverDirective.prototype, "_click", null);
        FileSaverDirective = __decorate$1([
            core.Directive({
                selector: '[fileSaver]',
                exportAs: 'fileSaver',
            }),
            __metadata("design:paramtypes", [core.ElementRef, FileSaverService, http.HttpClient])
        ], FileSaverDirective);
        return FileSaverDirective;
    }());

    var __decorate$2 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var FileSaverModule = /** @class */ (function () {
        function FileSaverModule() {
        }
        FileSaverModule = __decorate$2([
            core.NgModule({
                declarations: [FileSaverDirective],
                exports: [FileSaverDirective],
            })
        ], FileSaverModule);
        return FileSaverModule;
    }());

    exports.FileSaverDirective = FileSaverDirective;
    exports.FileSaverModule = FileSaverModule;
    exports.FileSaverService = FileSaverService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-filesaver.umd.js.map

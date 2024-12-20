/*!
 * @pixi/graphics-smooth - v1.1.1
 * Compiled Fri, 20 Dec 2024 18:57:14 UTC
 *
 * @pixi/graphics-smooth is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2024, Ivan Popelyshev, All Rights Reserved
 */import{BatchTextureArray as Et,BLEND_MODES as ct,BaseTexture as It,Matrix as j,Texture as V,Shader as St,Program as Nt,SHAPES as P,Point as q,utils as ut,Geometry as Pt,Buffer as dt,TYPES as C,WRAP_MODES as At,Color as B,State as Ot,Polygon as it,PI_2 as pt,Rectangle as Dt,RoundedRectangle as wt,Circle as Ct,Ellipse as Mt,MSAA_QUALITY as Bt,DRAW_MODES as Rt}from"@pixi/core";import{LINE_CAP as $,LINE_JOIN as R,Graphics as Ut,graphicsUtils as Ft,curves as kt}from"@pixi/graphics";import{Bounds as ft,Container as zt}from"@pixi/display";function st(n,t,s=.001){return n===t||Math.abs(n.a-t.a)<s&&Math.abs(n.b-t.b)<s&&Math.abs(n.c-t.c)<s&&Math.abs(n.d-t.d)<s&&Math.abs(n.tx-t.tx)<s&&Math.abs(n.ty-t.ty)<s}class yt{constructor(){this.textureIds=[],this.matrices=[],this.lines=[],this.count=0}clear(){for(let t=0;t<this.count;t++)this.textureIds[t]=null,this.matrices[t]=null;this.count=0}add(t,s,e,r,i,l){const{textureIds:a,matrices:c,lines:p,count:u}=this;t=t*4+i;for(let o=0;o<u;o++)if(p[o*2]===e&&p[o*2+1]===r&&a[o]===t&&st(c[o],s))return o;return u>=l.maxStyles?-1:(a[u]=t,c[u]=s,p[u*2]=e,p[u*2+1]=r,this.count++,u)}}class nt{constructor(){this.texArray=new Et,this.styleArray=new yt,this.shader=null,this.blend=ct.NORMAL,this.start=0,this.size=0,this.TICK=0,this.settings=null,this.data=null}clear(){this.texArray.clear(),this.styleArray.clear(),this.settings=null,this.data=null,this.shader=null}begin(t,s){this.TICK=++It._globalBatch,this.settings=t,this.shader=s,this.start=0,this.size=0,this.data=null,s&&s.settings&&(this.settings=s.settings)}check(t){return this.size===0?(this.shader=t,!0):this.shader===t}add(t,s,e,r,i){const{texArray:l,TICK:a,styleArray:c,settings:p}=this,{baseTexture:u}=t;if(u._batchEnabled!==a&&l.count===p.maxTextures)return-1;const o=u._batchEnabled!==a?l.count:u._batchLocation,h=c.add(o,s||j.IDENTITY,e,r,i,p);return h>=0&&u._batchEnabled!==a&&(u._batchEnabled=a,u._batchLocation=l.count,l.elements[l.count++]=u),h}}class xt{constructor(){this.reset()}begin(t,s,e){this.reset(),this.style=t,this.start=s,this.attribStart=e,this.jointEnd=0}end(t,s){this.attribSize=s-this.attribStart,this.size=t-this.start}reset(){this.style=null,this.size=0,this.start=0,this.attribStart=0,this.attribSize=0,this.styleId=-1,this.rgba=0,this.jointEnd=0}}class vt{constructor(){this.verts=[],this.joints=[],this.vertexSize=0,this.indexSize=0,this.closePointEps=1e-4}clear(){this.verts.length=0,this.joints.length=0,this.vertexSize=0,this.indexSize=0}destroy(){this.verts.length=0,this.joints.length=0}}var f=(n=>(n[n.NONE=0]="NONE",n[n.FILL=1]="FILL",n[n.JOINT_BEVEL=4]="JOINT_BEVEL",n[n.JOINT_MITER=8]="JOINT_MITER",n[n.JOINT_ROUND=12]="JOINT_ROUND",n[n.JOINT_CAP_BUTT=16]="JOINT_CAP_BUTT",n[n.JOINT_CAP_SQUARE=18]="JOINT_CAP_SQUARE",n[n.JOINT_CAP_ROUND=20]="JOINT_CAP_ROUND",n[n.FILL_EXPAND=24]="FILL_EXPAND",n[n.CAP_BUTT=32]="CAP_BUTT",n[n.CAP_SQUARE=64]="CAP_SQUARE",n[n.CAP_ROUND=96]="CAP_ROUND",n[n.CAP_BUTT2=128]="CAP_BUTT2",n))(f||{});class Y{constructor(){this.reset()}toJSON(){return this.copyTo({})}clone(){return this.copyTo(new Y)}copyTo(t){return t.color=this.color,t.alpha=this.alpha,t.texture=this.texture,t.matrix=this.matrix,t.shader=this.shader,t.visible=this.visible,t.smooth=this.smooth,t.matrixTex=null,t}packLineScale(){return 0}reset(){this.color=16777215,this.alpha=1,this.texture=V.WHITE,this.matrix=null,this.shader=null,this.visible=!1,this.smooth=!1,this.matrixTex=null}destroy(){this.texture=null,this.matrix=null,this.matrixTex=null}getTextureMatrix(){const t=this.texture;return this.matrix?t.frame.width===t.baseTexture.width&&t.frame.height===t.baseTexture.height?this.matrix:(this.matrixTex?this.matrixTex.copyFrom(this.matrix):this.matrixTex=this.matrix.clone(),this.matrixTex.translate(Number(t.frame.x),Number(t.frame.y)),this.matrixTex):null}}var M=(n=>(n.NONE="none",n.NORMAL="normal",n.HORIZONTAL="horizontal",n.VERTICAL="vertical",n))(M||{});class et extends Y{clone(){return this.copyTo(new et)}copyTo(t){return t.color=this.color,t.alpha=this.alpha,t.texture=this.texture,t.matrix=this.matrix,t.shader=this.shader,t.visible=this.visible,t.width=this.width,t.alignment=this.alignment,t.cap=this.cap,t.join=this.join,t.miterLimit=this.miterLimit,t.scaleMode=this.scaleMode,t}packLineScale(){switch(this.scaleMode){case"normal":return 1;case"horizontal":return 2;case"vertical":return 3;default:return 0}}reset(){super.reset(),this.smooth=!0,this.color=0,this.width=0,this.alignment=.5,this.cap=$.BUTT,this.join=R.MITER,this.miterLimit=10,this.scaleMode="normal"}}const U=class{constructor(){this.strideFloats=12,this.bufferPos=0,this.indexPos=0}updateBufferSize(n,t,s,e){const{joints:r}=e;let i=!1,l=0,a=0;for(let c=n;c<n+t;c++){const p=r[c]&-32,u=r[c]&31;if(u===f.FILL){i=!0,l++;continue}if(u>=f.FILL_EXPAND){l+=3,a+=3;continue}const o=U.vertsByJoint[u]+U.vertsByJoint[p];o>=4&&(l+=o,a+=6+3*Math.max(o-6,0))}i&&(a+=s),e.vertexSize+=l,e.indexSize+=a}beginPack(n,t,s,e,r=0,i=0){this.buildData=n,this.bufFloat=t,this.bufUint=s,this.indices=e,this.bufferPos=r,this.indexPos=i}endPack(){this.buildData=null,this.bufFloat=null,this.bufUint=null,this.indices=null}packInterleavedGeometry(n,t,s,e,r){const{bufFloat:i,bufUint:l,indices:a,buildData:c,strideFloats:p}=this,{joints:u,verts:o}=c;let h=this.bufferPos,d=this.indexPos,x=this.bufferPos/this.strideFloats,v,y,g,b,L,E,I,_,m=!1,N=0;for(let T=n;T<n+t;T++){const w=u[T],Q=u[T]&-32,A=u[T]&31;if(A===f.FILL){m=!0,v=o[T*2],y=o[T*2+1],i[h]=v,i[h+1]=y,i[h+2]=v,i[h+3]=y,i[h+4]=v,i[h+5]=y,i[h+6]=v,i[h+7]=y,i[h+8]=N,i[h+9]=16*A,i[h+10]=e,l[h+11]=r,h+=p;continue}if(A>=f.FILL_EXPAND){L=o[T*2],E=o[T*2+1],v=o[T*2+2],y=o[T*2+3],g=o[T*2+4],b=o[T*2+5];const O=T+3;for(let X=0;X<3;X++)i[h]=L,i[h+1]=E,i[h+2]=v,i[h+3]=y,i[h+4]=g,i[h+5]=b,i[h+6]=o[(O+X)*2],i[h+7]=o[(O+X)*2+1],i[h+8]=N,i[h+9]=16*w+X,i[h+10]=e,l[h+11]=r,h+=p;a[d]=x,a[d+1]=x+1,a[d+2]=x+2,d+=3,x+=3;continue}const D=U.vertsByJoint[A]+U.vertsByJoint[Q];if(D===0)continue;v=o[T*2],y=o[T*2+1],g=o[T*2+2],b=o[T*2+3],L=o[T*2-2],E=o[T*2-1];const J=Math.sqrt((g-v)*(g-v)+(b-y)*(b-y));U.vertsByJoint[A]===0&&(N-=J),(A&-3)!==f.JOINT_CAP_BUTT?(I=o[T*2+4],_=o[T*2+5]):(I=v,_=y);for(let O=0;O<D;O++)i[h]=L,i[h+1]=E,i[h+2]=v,i[h+3]=y,i[h+4]=g,i[h+5]=b,i[h+6]=I,i[h+7]=_,i[h+8]=N,i[h+9]=16*w+O,i[h+10]=e,l[h+11]=r,h+=p;N+=J,a[d]=x,a[d+1]=x+1,a[d+2]=x+2,a[d+3]=x,a[d+4]=x+2,a[d+5]=x+3,d+=6;for(let O=5;O+1<D;O++)a[d]=x+4,a[d+1]=x+O,a[d+2]=x+O+1,d+=3;x+=D}if(m){for(let T=0;T<s.length;T++)a[d+T]=s[T]+x;d+=s.length}this.bufferPos=h,this.indexPos=d}};let K=U;K.vertsByJoint=[];const S=K.vertsByJoint;for(let n=0;n<256;n++)S.push(0);S[f.FILL]=1;for(let n=0;n<8;n++)S[f.FILL_EXPAND+n]=3;S[f.JOINT_BEVEL]=4+5,S[f.JOINT_BEVEL+1]=4+5,S[f.JOINT_BEVEL+2]=4+5,S[f.JOINT_BEVEL+3]=4+5,S[f.JOINT_ROUND]=4+5,S[f.JOINT_ROUND+1]=4+5,S[f.JOINT_ROUND+2]=4+5,S[f.JOINT_ROUND+3]=4+5,S[f.JOINT_MITER]=4+5,S[f.JOINT_MITER+1]=4+5,S[f.JOINT_MITER+2]=4,S[f.JOINT_MITER+3]=4,S[f.JOINT_CAP_BUTT]=4,S[f.JOINT_CAP_BUTT+1]=4,S[f.JOINT_CAP_SQUARE]=4,S[f.JOINT_CAP_SQUARE+1]=4,S[f.JOINT_CAP_ROUND]=4+5,S[f.JOINT_CAP_ROUND+1]=4+5,S[f.CAP_ROUND]=4;class G{constructor(t,s=null,e=null,r=null){this.shape=t,this.lineStyle=e,this.fillStyle=s,this.matrix=r,this.type=t.type,this.points=[],this.holes=[],this.triangles=[],this.closeStroke=!1,this.clearBuild()}clearPath(){this.points.length=0,this.closeStroke=!0}clearBuild(){this.triangles.length=0,this.fillStart=0,this.fillLen=0,this.strokeStart=0,this.strokeLen=0,this.fillAA=!1}clone(){return new G(this.shape,this.fillStyle,this.lineStyle,this.matrix)}capType(){let t;switch(this.lineStyle.cap){case $.SQUARE:t=f.CAP_SQUARE;break;case $.ROUND:t=f.CAP_ROUND;break;default:t=f.CAP_BUTT;break}return t}goodJointType(){let t;switch(this.lineStyle.join){case R.BEVEL:t=f.JOINT_BEVEL;break;case R.ROUND:t=f.JOINT_ROUND;break;default:t=f.JOINT_MITER+3;break}return t}jointType(){let t;switch(this.lineStyle.join){case R.BEVEL:t=f.JOINT_BEVEL;break;case R.ROUND:t=f.JOINT_ROUND;break;default:t=f.JOINT_MITER;break}return t}destroy(){this.shape=null,this.holes.length=0,this.holes=null,this.points.length=0,this.points=null,this.lineStyle=null,this.fillStyle=null,this.triangles=null}}const mt=`#version 100
precision highp float;
const float FILL = 1.0;
const float BEVEL = 4.0;
const float MITER = 8.0;
const float ROUND = 12.0;
const float JOINT_CAP_BUTT = 16.0;
const float JOINT_CAP_SQUARE = 18.0;
const float JOINT_CAP_ROUND = 20.0;

const float FILL_EXPAND = 24.0;

const float CAP_BUTT = 1.0;
const float CAP_SQUARE = 2.0;
const float CAP_ROUND = 3.0;
const float CAP_BUTT2 = 4.0;

const float MITER_LIMIT = 10.0;

// === geom ===
attribute vec2 aPrev;
attribute vec2 aPoint1;
attribute vec2 aPoint2;
attribute vec2 aNext;
attribute float aVertexJoint;
attribute float aTravel;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform vec4 tint;

varying vec4 vLine1;
varying vec4 vLine2;
varying vec4 vArc;
varying float vType;

uniform float resolution;
uniform float expand;

// === style ===
attribute float aStyleId;
attribute vec4 aColor;

varying float vTextureId;
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec2 vTravel;

uniform vec2 styleLine[%MAX_STYLES%];
uniform vec3 styleMatrix[2 * %MAX_STYLES%];
uniform float styleTextureId[%MAX_STYLES%];
uniform vec2 samplerSize[%MAX_TEXTURES%];

vec2 doBisect(vec2 norm, float len, vec2 norm2, float len2,
    float dy, float inner) {
    vec2 bisect = (norm + norm2) / 2.0;
    bisect /= dot(norm, bisect);
    vec2 shift = dy * bisect;
    if (inner > 0.5) {
        if (len < len2) {
            if (abs(dy * (bisect.x * norm.y - bisect.y * norm.x)) > len) {
                return dy * norm;
            }
        } else {
            if (abs(dy * (bisect.x * norm2.y - bisect.y * norm2.x)) > len2) {
                return dy * norm;
            }
        }
    }
    return dy * bisect;
}

void main(void){
    vec2 pointA = (translationMatrix * vec3(aPoint1, 1.0)).xy;
    vec2 pointB = (translationMatrix * vec3(aPoint2, 1.0)).xy;

    vec2 xBasis = pointB - pointA;
    float len = length(xBasis);
    vec2 forward = xBasis / len;
    vec2 norm = vec2(forward.y, -forward.x);

    float type = floor(aVertexJoint / 16.0);
    float vertexNum = aVertexJoint - type * 16.0;
    float dx = 0.0, dy = 1.0;

    float capType = floor(type / 32.0);
    type -= capType * 32.0;

    int styleId = int(aStyleId + 0.5);
    float lineWidth = styleLine[styleId].x;
    vTextureId = floor(styleTextureId[styleId] / 4.0);
    float scaleMode = styleTextureId[styleId] - vTextureId * 4.0;
    float avgScale = 1.0;
    if (scaleMode > 2.5) {
        avgScale = length(translationMatrix * vec3(1.0, 0.0, 0.0));
    } else if (scaleMode > 1.5) {
        avgScale = length(translationMatrix * vec3(0.0, 1.0, 0.0));
    } else if (scaleMode > 0.5) {
        vec2 avgDiag = (translationMatrix * vec3(1.0, 1.0, 0.0)).xy;
        avgScale = sqrt(dot(avgDiag, avgDiag) * 0.5);
    }
    lineWidth *= 0.5 * avgScale;
    float lineAlignment = 2.0 * styleLine[styleId].y - 1.0;
    vTextureCoord = vec2(0.0);

    vec2 pos;

    if (capType == CAP_ROUND) {
        vertexNum += 4.0;
        type = JOINT_CAP_ROUND;
        capType = 0.0;
        lineAlignment = -lineAlignment;
    }

    vLine1 = vec4(0.0, 10.0, 1.0, 0.0);
    vLine2 = vec4(0.0, 10.0, 1.0, 0.0);
    vArc = vec4(0.0);
    if (type == FILL) {
        pos = pointA;
        vType = 0.0;
        vLine2 = vec4(-2.0, -2.0, -2.0, 0.0);
        vec2 vTexturePixel;
        vTexturePixel.x = dot(vec3(aPoint1, 1.0), styleMatrix[styleId * 2]);
        vTexturePixel.y = dot(vec3(aPoint1, 1.0), styleMatrix[styleId * 2 + 1]);
        vTextureCoord = vTexturePixel / samplerSize[int(vTextureId)];
    } else if (type >= FILL_EXPAND && type < FILL_EXPAND + 7.5) {
        // expand vertices
        float flags = type - FILL_EXPAND;
        float flag3 = floor(flags / 4.0);
        float flag2 = floor((flags - flag3 * 4.0) / 2.0);
        float flag1 = flags - flag3 * 4.0 - flag2 * 2.0;

        vec2 prev = (translationMatrix * vec3(aPrev, 1.0)).xy;

        if (vertexNum < 0.5) {
            pos = prev;
        } else if (vertexNum < 1.5) {
            pos = pointA;
        } else {
            pos = pointB;
        }
        float len2 = length(aNext);
        vec2 bisect = (translationMatrix * vec3(aNext, 0.0)).xy;
        if (len2 > 0.01) {
            bisect = normalize(bisect) * len2;
        }

        vec2 n1 = normalize(vec2(pointA.y - prev.y, -(pointA.x - prev.x)));
        vec2 n2 = normalize(vec2(pointB.y - pointA.y, -(pointB.x - pointA.x)));
        vec2 n3 = normalize(vec2(prev.y - pointB.y, -(prev.x - pointB.x)));

        if (n1.x * n2.y - n1.y * n2.x < 0.0) {
            n1 = -n1;
            n2 = -n2;
            n3 = -n3;
        }
        pos += bisect * expand;

        vLine1 = vec4(16.0, 16.0, 16.0, -1.0);
        if (flag1 > 0.5) {
            vLine1.x = -dot(pos - prev, n1);
        }
        if (flag2 > 0.5) {
            vLine1.y = -dot(pos - pointA, n2);
        }
        if (flag3 > 0.5) {
            vLine1.z = -dot(pos - pointB, n3);
        }
        vLine1.xyz *= resolution;
        vType = 2.0;
    } else if (type >= BEVEL) {
        float dy = lineWidth + expand;
        float shift = lineWidth * lineAlignment;
        float inner = 0.0;
        if (vertexNum >= 1.5) {
            dy = -dy;
            inner = 1.0;
        }

        vec2 base, next, xBasis2, bisect;
        float flag = 0.0;
        float side2 = 1.0;
        if (vertexNum < 0.5 || vertexNum > 2.5 && vertexNum < 3.5) {
            next = (translationMatrix * vec3(aPrev, 1.0)).xy;
            base = pointA;
            flag = type - floor(type / 2.0) * 2.0;
            side2 = -1.0;
        } else {
            next = (translationMatrix * vec3(aNext, 1.0)).xy;
            base = pointB;
            if (type >= MITER && type < MITER + 3.5) {
                flag = step(MITER + 1.5, type);
                // check miter limit here?
            }
        }
        xBasis2 = next - base;
        float len2 = length(xBasis2);
        vec2 norm2 = vec2(xBasis2.y, -xBasis2.x) / len2;
        float D = norm.x * norm2.y - norm.y * norm2.x;
        if (D < 0.0) {
            inner = 1.0 - inner;
        }

        norm2 *= side2;

        float collinear = step(0.0, dot(norm, norm2));

        vType = 0.0;
        float dy2 = -1000.0;

        if (abs(D) < 0.01 && collinear < 0.5) {
            if (type >= ROUND && type < ROUND + 1.5) {
                type = JOINT_CAP_ROUND;
            }
            //TODO: BUTT here too
        }

        vLine1 = vec4(0.0, lineWidth, max(abs(norm.x), abs(norm.y)), min(abs(norm.x), abs(norm.y)));
        vLine2 = vec4(0.0, lineWidth, max(abs(norm2.x), abs(norm2.y)), min(abs(norm2.x), abs(norm2.y)));

        if (vertexNum < 3.5) {
            if (abs(D) < 0.01 && collinear < 0.5) {
                pos = (shift + dy) * norm;
            } else {
                if (flag < 0.5 && inner < 0.5) {
                    pos = (shift + dy) * norm;
                } else {
                    pos = doBisect(norm, len, norm2, len2, shift + dy, inner);
                }
            }
            vLine2.y = -1000.0;
            if (capType >= CAP_BUTT && capType < CAP_ROUND) {
                float extra = step(CAP_SQUARE, capType) * lineWidth;
                vec2 back = -forward;
                if (vertexNum < 0.5 || vertexNum > 2.5) {
                    pos += back * (expand + extra);
                    dy2 = expand;
                } else {
                    dy2 = dot(pos + base - pointA, back) - extra;
                }
            }
            if (type >= JOINT_CAP_BUTT && type < JOINT_CAP_SQUARE + 0.5) {
                float extra = step(JOINT_CAP_SQUARE, type) * lineWidth;
                if (vertexNum < 0.5 || vertexNum > 2.5) {
                    vLine2.y = dot(pos + base - pointB, forward) - extra;
                } else {
                    pos += forward * (expand + extra);
                    vLine2.y = expand;
                    if (capType >= CAP_BUTT) {
                        dy2 -= expand + extra;
                    }
                }
            }
        } else if (type >= JOINT_CAP_ROUND && type < JOINT_CAP_ROUND + 1.5) {
            base += shift * norm;
            if (inner > 0.5) {
                dy = -dy;
                inner = 0.0;
            }
            vec2 d2 = abs(dy) * forward;
            if (vertexNum < 4.5) {
                dy = -dy;
                pos = dy * norm;
            } else if (vertexNum < 5.5) {
                pos = dy * norm;
            } else if (vertexNum < 6.5) {
                pos = dy * norm + d2;
                vArc.x = abs(dy);
            } else {
                dy = -dy;
                pos = dy * norm + d2;
                vArc.x = abs(dy);
            }
            vLine2 = vec4(0.0, lineWidth * 2.0 + 10.0, 1.0  , 0.0); // forget about line2 with type=3
            vArc.y = dy;
            vArc.z = 0.0;
            vArc.w = lineWidth;
            vType = 3.0;
        } else if (abs(D) < 0.01 && collinear < 0.5) {
            pos = dy * norm;
        } else {
            if (inner > 0.5) {
                dy = -dy;
                inner = 0.0;
            }
            float side = sign(dy);
            vec2 norm3 = normalize(norm + norm2);

            if (type >= MITER && type < MITER + 3.5) {
                vec2 farVertex = doBisect(norm, len, norm2, len2, shift + dy, 0.0);
                if (length(farVertex) > abs(shift + dy) * MITER_LIMIT) {
                    type = BEVEL;
                }
            }

            if (vertexNum < 4.5) {
                pos = doBisect(norm, len, norm2, len2, shift - dy, 1.0);
            } else if (vertexNum < 5.5) {
                pos = (shift + dy) * norm;
            } else if (vertexNum > 7.5) {
                pos = (shift + dy) * norm2;
            } else {
                if (type >= ROUND && type < ROUND + 1.5) {
                    pos = doBisect(norm, len, norm2, len2, shift + dy, 0.0);
                    float d2 = abs(shift + dy);
                    if (length(pos) > abs(shift + dy) * 1.5) {
                        if (vertexNum < 6.5) {
                            pos.x = (shift + dy) * norm.x - d2 * norm.y;
                            pos.y = (shift + dy) * norm.y + d2 * norm.x;
                        } else {
                            pos.x = (shift + dy) * norm2.x + d2 * norm2.y;
                            pos.y = (shift + dy) * norm2.y - d2 * norm2.x;
                        }
                    }
                } else if (type >= MITER && type < MITER + 3.5) {
                    pos = doBisect(norm, len, norm2, len2, shift + dy, 0.0); //farVertex
                } else if (type >= BEVEL && type < BEVEL + 1.5) {
                    float d2 = side / resolution;
                    if (vertexNum < 6.5) {
                        pos = (shift + dy) * norm + d2 * norm3;
                    } else {
                        pos = (shift + dy) * norm2 + d2 * norm3;
                    }
                }
            }

            if (type >= ROUND && type < ROUND + 1.5) {
                vArc.x = side * dot(pos, norm3);
                vArc.y = pos.x * norm3.y - pos.y * norm3.x;
                vArc.z = dot(norm, norm3) * (lineWidth + side * shift);
                vArc.w = lineWidth + side * shift;
                vType = 3.0;
            } else if (type >= MITER && type < MITER + 3.5) {
                vType = 1.0;
            } else if (type >= BEVEL && type < BEVEL + 1.5) {
                vType = 4.0;
                vArc.z = dot(norm, norm3) * (lineWidth + side * shift) - side * dot(pos, norm3);
            }

            dy = side * (dot(pos, norm) - shift);
            dy2 = side * (dot(pos, norm2) - shift);
        }

        pos += base;
        vLine1.xy = vec2(dy, vLine1.y) * resolution;
        vLine2.xy = vec2(dy2, vLine2.y) * resolution;
        vArc = vArc * resolution;
        vTravel = vec2(aTravel * avgScale + dot(pos - pointA, vec2(-norm.y, norm.x)), avgScale);
    }

    gl_Position = vec4((projectionMatrix * vec3(pos, 1.0)).xy, 0.0, 1.0);

    vColor = aColor * tint;
}`,Jt=`#version 100
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
`,gt=`%PRECISION%
varying vec4 vColor;
varying vec4 vLine1;
varying vec4 vLine2;
varying vec4 vArc;
varying float vType;
varying float vTextureId;
varying vec2 vTextureCoord;
varying vec2 vTravel;
uniform sampler2D uSamplers[%MAX_TEXTURES%];

%PIXEL_LINE%

void main(void){
    %PIXEL_COVERAGE%

    vec4 texColor;
    float textureId = floor(vTextureId+0.5);
    %FOR_LOOP%

    gl_FragColor = vColor * texColor * alpha;
}
`,Xt=[`
float pixelLine(float x, float A, float B) {
    return clamp(x + 0.5, 0.0, 1.0);
}
`,`
float pixelLine(float x, float A, float B) {
    float y = abs(x), s = sign(x);
    if (y * 2.0 < A - B) {
        return 0.5 + s * y / A;
    }
    y -= (A - B) * 0.5;
    y = max(1.0 - y / B, 0.0);
    return (1.0 + s * (1.0 - y * y)) * 0.5;
    //return clamp(x + 0.5, 0.0, 1.0);
}
`],jt=`float alpha = 1.0;
if (vType < 0.5) {
    float left = pixelLine(-vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float right = pixelLine(vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float near = vLine2.x - 0.5;
    float far = min(vLine2.x + 0.5, 0.0);
    float top = vLine2.y - 0.5;
    float bottom = min(vLine2.y + 0.5, 0.0);
    alpha = (right - left) * max(bottom - top, 0.0) * max(far - near, 0.0);
} else if (vType < 1.5) {
    float a1 = pixelLine(- vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float a2 = pixelLine(vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float b1 = pixelLine(- vLine2.y - vLine2.x, vLine2.z, vLine2.w);
    float b2 = pixelLine(vLine2.y - vLine2.x, vLine2.z, vLine2.w);
    alpha = a2 * b2 - a1 * b1;
} else if (vType < 2.5) {
    alpha *= max(min(vLine1.x + 0.5, 1.0), 0.0);
    alpha *= max(min(vLine1.y + 0.5, 1.0), 0.0);
    alpha *= max(min(vLine1.z + 0.5, 1.0), 0.0);
} else if (vType < 3.5) {
    float a1 = pixelLine(- vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float a2 = pixelLine(vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float b1 = pixelLine(- vLine2.y - vLine2.x, vLine2.z, vLine2.w);
    float b2 = pixelLine(vLine2.y - vLine2.x, vLine2.z, vLine2.w);
    float alpha_miter = a2 * b2 - a1 * b1;
    float alpha_plane = clamp(vArc.z - vArc.x + 0.5, 0.0, 1.0);
    float d = length(vArc.xy);
    float circle_hor = max(min(vArc.w, d + 0.5) - max(-vArc.w, d - 0.5), 0.0);
    float circle_vert = min(vArc.w * 2.0, 1.0);
    float alpha_circle = circle_hor * circle_vert;
    alpha = min(alpha_miter, max(alpha_circle, alpha_plane));
} else {
    float a1 = pixelLine(- vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float a2 = pixelLine(vLine1.y - vLine1.x, vLine1.z, vLine1.w);
    float b1 = pixelLine(- vLine2.y - vLine2.x, vLine2.z, vLine2.w);
    float b2 = pixelLine(vLine2.y - vLine2.x, vLine2.z, vLine2.w);
    alpha = a2 * b2 - a1 * b1;
    alpha *= clamp(vArc.z + 0.5, 0.0, 1.0);
}
`;class z extends St{constructor(t,s=mt,e=gt,r={}){s=z.generateVertexSrc(t,s),e=z.generateFragmentSrc(t,e);const{maxStyles:i,maxTextures:l}=t,a=new Int32Array(l);for(let c=0;c<l;c++)a[c]=c;super(Nt.from(s,e),Object.assign(r,{styleMatrix:new Float32Array(6*i),styleTextureId:new Float32Array(i),styleLine:new Float32Array(2*i),samplerSize:new Float32Array(2*l),uSamplers:a,tint:new Float32Array([1,1,1,1]),resolution:1,expand:1})),this.settings=t}static generateVertexSrc(t,s=mt){const{maxStyles:e,maxTextures:r}=t;return s=s.replace(/%MAX_TEXTURES%/gi,`${r}`).replace(/%MAX_STYLES%/gi,`${e}`),s}static generateFragmentSrc(t,s=gt){const{maxTextures:e,pixelLine:r}=t;return s=s.replace(/%PRECISION%/gi,Jt).replace(/%PIXEL_LINE%/gi,Xt[r]).replace(/%PIXEL_COVERAGE%/gi,jt).replace(/%MAX_TEXTURES%/gi,`${e}`).replace(/%FOR_LOOP%/gi,this.generateSampleSrc(e)),s}static generateSampleSrc(t){let s="";s+=`
`,s+=`
`;for(let e=0;e<t;e++)e>0&&(s+=`
else `),e<t-1&&(s+=`if(textureId < ${e}.5)`),s+=`
{`,s+=`
	texColor = texture2D(uSamplers[${e}], vTextureCoord);`,s+=`
}`;return s+=`
`,s+=`
`,s}}const Vt=`%PRECISION%
varying vec4 vColor;
varying vec4 vLine1;
varying vec4 vLine2;
varying vec4 vArc;
varying float vType;
varying float vTextureId;
varying vec2 vTextureCoord;
varying vec2 vTravel;
uniform sampler2D uSamplers[%MAX_TEXTURES%];
uniform float dash;
uniform float gap;

%PIXEL_LINE%

void main(void){
    %PIXEL_COVERAGE%

    float d = dash * vTravel.y;
    if (d > 0.0) {
        float g = gap * vTravel.y;
        if (g > 0.0) {
            float t = mod(vTravel.x, d + g);
            alpha *= mix(
                min(0.5 * d + 0.5 - abs(t - 0.5 * d), 1.0),
                max(abs(t - 0.5 * g - d) - 0.5 * g + 0.5, 0.0),
                step(d, t)
            );
        }
    } else {
        alpha = 0.0;
    }

    vec4 texColor;
    float textureId = floor(vTextureId+0.5);
    %FOR_LOOP%

    gl_FragColor = vColor * texColor * alpha;
}
`;class Ht extends z{constructor(t){const s={maxStyles:16,maxTextures:1,pixelLine:1};super(s,void 0,Vt,t||{dash:8,gap:5})}}const F={LINE_SCALE_MODE:M.NORMAL,SHADER_MAX_STYLES:24,SHADER_MAX_TEXTURES:4,PIXEL_LINE:0};class Z{path(t,s){const e=t.points;let r,i,l,a,c,p;if(t.type===P.CIRC){const y=t.shape;r=y.x,i=y.y,c=p=y.radius,l=a=0}else if(t.type===P.ELIP){const y=t.shape;r=y.x,i=y.y,c=y.width,p=y.height,l=a=0}else{const y=t.shape,g=y.width/2,b=y.height/2;r=y.x+g,i=y.y+b,c=p=Math.max(0,Math.min(y.radius,Math.min(g,b))),l=g-c,a=b-p}if(!(c>=0&&p>=0&&l>=0&&a>=0)){e.length=0;return}const u=Math.ceil(2.3*Math.sqrt(c+p)),o=u*8+(l?4:0)+(a?4:0);if(e.length=o,o===0)return;if(u===0){e.length=8,e[0]=e[6]=r+l,e[1]=e[3]=i+a,e[2]=e[4]=r-l,e[5]=e[7]=i-a;return}let h=0,d=u*4+(l?2:0)+2,x=d,v=o;{const y=l+c,g=a,b=r+y,L=r-y,E=i+g;if(e[h++]=b,e[h++]=E,e[--d]=E,e[--d]=L,a){const I=i-g;e[x++]=L,e[x++]=I,e[--v]=I,e[--v]=b}}for(let y=1;y<u;y++){const g=Math.PI/2*(y/u),b=l+Math.cos(g)*c,L=a+Math.sin(g)*p,E=r+b,I=r-b,_=i+L,m=i-L;e[h++]=E,e[h++]=_,e[--d]=_,e[--d]=I,e[x++]=I,e[x++]=m,e[--v]=m,e[--v]=E}{const y=l,g=a+p,b=r+y,L=r-y,E=i+g,I=i-g;e[h++]=b,e[h++]=E,e[--v]=I,e[--v]=b,l&&(e[h++]=L,e[h++]=E,e[--v]=I,e[--v]=L)}}fill(t,s){const{verts:e,joints:r}=s,{points:i,triangles:l}=t;if(i.length===0)return;let a,c;if(t.type!==P.RREC){const _=t.shape;a=_.x,c=_.y}else{const _=t.shape;a=_.x+_.width/2,c=_.y+_.height/2}const p=t.matrix,u=p?p.a*a+p.c*c+p.tx:a,o=p?p.b*a+p.d*c+p.ty:c;let h=1;const d=0;if(!t.fillAA){e.push(u,o),r.push(f.FILL),e.push(i[0],i[1]),r.push(f.FILL);for(let _=2;_<i.length;_+=2)e.push(i[_],i[_+1]),r.push(f.FILL),l.push(h++,d,h);l.push(d+1,d,h);return}const x=i.length;let v=i[x-2],y=i[x-1],g=y-i[x-3],b=i[x-4]-v;const L=Math.sqrt(g*g+b*b);g/=L,b/=L;let E,I;for(let _=0;_<x;_+=2){const m=i[_],N=i[_+1];let T=N-y,w=v-m;const Q=Math.sqrt(T*T+w*w);T/=Q,w/=Q;let A=g+T,D=b+w;const J=T*A+w*D;A/=J,D/=J,_>0?(e.push(A),e.push(D)):(E=A,I=D),e.push(u),e.push(o),e.push(v),e.push(y),e.push(m),e.push(N),e.push(0),e.push(0),e.push(A),e.push(D),r.push(f.FILL_EXPAND+2),r.push(f.NONE),r.push(f.NONE),r.push(f.NONE),r.push(f.NONE),r.push(f.NONE),v=m,y=N,g=T,b=w}e.push(E),e.push(I)}line(t,s){const{verts:e,joints:r}=s,{points:i}=t,l=i.length===8?t.goodJointType():f.JOINT_MITER+3,a=i.length;if(a!==0){e.push(i[a-2],i[a-1]),r.push(f.NONE);for(let c=0;c<a;c+=2)e.push(i[c],i[c+1]),r.push(l);e.push(i[0],i[1]),r.push(f.NONE),e.push(i[2],i[3]),r.push(f.NONE)}}}const Wt=[];function bt(n,t=!1){const s=n.length;if(s<6)return;let e=0;for(let r=0,i=n[s-2],l=n[s-1];r<s;r+=2){const a=n[r],c=n[r+1];e+=(a-i)*(c+l),i=a,l=c}if(!t&&e>0||t&&e<=0){const r=s/2;for(let i=r+r%2;i<s;i+=2){const l=s-i-2,a=s-i-1,c=i,p=i+1;[n[l],n[c]]=[n[c],n[l]],[n[a],n[p]]=[n[p],n[a]]}}}class rt{path(t,s){const e=t.shape,r=t.points=e.points.slice(),i=s.closePointEps,l=i*i;if(r.length===0)return;const a=new q(r[0],r[1]),c=new q(r[r.length-2],r[r.length-1]),p=t.closeStroke=e.closeStroke;let u=r.length,o=2;for(let h=2;h<u;h+=2){const d=r[h-2],x=r[h-1],v=r[h],y=r[h+1];let g=!0;Math.abs(d-v)<i&&Math.abs(x-y)<i&&(g=!1),g&&(r[o]=r[h],r[o+1]=r[h+1],o+=2)}r.length=u=o,o=2;for(let h=2;h+2<u;h+=2){let d=r[h-2],x=r[h-1];const v=r[h],y=r[h+1];let g=r[h+2],b=r[h+3];d-=v,x-=y,g-=v,b-=y;let L=!0;Math.abs(g*x-b*d)<l&&d*g+x*b<-l&&(L=!1),L&&(r[o]=r[h],r[o+1]=r[h+1],o+=2)}r[o]=r[u-2],r[o+1]=r[u-1],o+=2,r.length=u=o,!(u<=2)&&p&&Math.abs(a.x-c.x)<i&&Math.abs(a.y-c.y)<i&&(r.pop(),r.pop())}line(t,s){const{closeStroke:e,points:r}=t,i=r.length;if(i<=2)return;const{verts:l,joints:a}=s,c=t.jointType(),p=t.capType();let u=0,o,h;e?(o=r[i-2],h=r[i-1],a.push(f.NONE)):(o=r[2],h=r[3],p===f.CAP_ROUND?(l.push(r[0],r[1]),a.push(f.NONE),a.push(f.CAP_ROUND),u=0):(u=p,a.push(f.NONE))),l.push(o,h);for(let d=0;d<i;d+=2){const x=r[d],v=r[d+1];let y=c;d+2>=i?e||(y=f.NONE):d+4>=i&&(e||(p===f.CAP_ROUND&&(y=f.JOINT_CAP_ROUND),p===f.CAP_BUTT&&(y=f.JOINT_CAP_BUTT),p===f.CAP_SQUARE&&(y=f.JOINT_CAP_SQUARE))),y+=u,u=0,l.push(x,v),a.push(y),o=x,h=v}e?(l.push(r[0],r[1]),a.push(f.NONE),l.push(r[2],r[3]),a.push(f.NONE)):(l.push(r[i-4],r[i-3]),a.push(f.NONE))}fill(t,s){let e=t.points;const r=t.holes,i=s.closePointEps,{verts:l,joints:a}=s;if(e.length<6)return;const c=[];let p=e.length;bt(e,!1);for(let d=0;d<r.length;d++){const x=r[d];bt(x.points,!0),c.push(e.length/2),e=e.concat(x.points)}const u=Wt;u.length<e.length&&(u.length=e.length);let o=0;for(let d=0;d<=c.length;d++){let x=p/2;d>0&&(d<c.length?x=c[d]:x=e.length>>1),u[o*2]=x-1,u[(x-1)*2+1]=o;for(let v=o;v+1<x;v++)u[v*2+1]=v+1,u[v*2+2]=v;o=x}if(t.triangles=ut.earcut(e,c,2),!t.triangles)return;if(!t.fillAA){for(let d=0;d<e.length;d+=2)l.push(e[d],e[d+1]),a.push(f.FILL);return}const{triangles:h}=t;p=e.length;for(let d=0;d<h.length;d+=3){let x=0;for(let v=0;v<3;v++){const y=h[d+v],g=h[d+(v+1)%3];(u[y*2]===g||u[y*2+1]===g)&&(x|=1<<v)}a.push(f.FILL_EXPAND+x),a.push(f.NONE),a.push(f.NONE),a.push(f.NONE),a.push(f.NONE),a.push(f.NONE)}for(let d=0;d<p/2;d++){const x=u[d*2],v=u[d*2+1];let y=e[v*2+1]-e[d*2+1],g=-(e[v*2]-e[d*2]),b=e[d*2+1]-e[x*2+1],L=-(e[d*2]-e[x*2]);const E=Math.sqrt(y*y+g*g);y/=E,g/=E;const I=Math.sqrt(b*b+L*L);b/=I,L/=I;let _=y+b,m=g+L;const N=_*y+m*g;Math.abs(N)<i?(_=y,m=g):(_/=N,m/=N),u[d*2]=_,u[d*2+1]=m}for(let d=0;d<h.length;d+=3){const x=h[d],v=h[d+1],y=h[d+2],g=e[y*2+1]-e[v*2+1],b=-(e[y*2]-e[v*2]),L=e[v*2+1]-e[x*2+1],E=-(e[v*2]-e[x*2]);let I=1;g*E-L*b>0&&(I=2);for(let _=0;_<3;_++){const m=h[d+_*I%3];l.push(e[m*2],e[m*2+1])}for(let _=0;_<3;_++){const m=h[d+_*I%3];l.push(u[m*2],u[m*2+1])}}}}class _t{constructor(){this._polyBuilder=new rt}path(t,s){const e=t.shape,r=e.x,i=e.y,l=e.width,a=e.height,c=t.points;c.length=0,c.push(r,i,r+l,i,r+l,i+a,r,i+a)}line(t,s){const{verts:e,joints:r}=s,{points:i}=t,l=t.goodJointType(),a=i.length;e.push(i[a-2],i[a-1]),r.push(f.NONE);for(let c=0;c<a;c+=2)e.push(i[c],i[c+1]),r.push(l);e.push(i[0],i[1]),r.push(f.NONE),e.push(i[2],i[3]),r.push(f.NONE)}fill(t,s){const{verts:e,joints:r}=s,{points:i,triangles:l}=t;if(l.length=0,!t.fillAA){e.push(i[0],i[1],i[2],i[3],i[4],i[5],i[6],i[7]),r.push(f.FILL,f.FILL,f.FILL,f.FILL),l.push(0,1,2,0,2,3);return}this._polyBuilder.fill(t,s)}}class Tt{constructor(){this._circleBuilder=new Z}path(t,s){this._circleBuilder.path(t,s)}line(t,s){this._circleBuilder.line(t,s)}fill(t,s){this._circleBuilder.fill(t,s)}}const H={[P.POLY]:new rt,[P.CIRC]:new Z,[P.ELIP]:new Z,[P.RECT]:new _t,[P.RREC]:new Tt},at=[],W=[],k=new q,Yt=new ft;class lt extends Pt{constructor(){super(),this.indicesUint16=null,this.initAttributes(!1),this.buildData=new vt,this.graphicsData=[],this.dirty=0,this.batchDirty=-1,this.cacheDirty=-1,this.clearDirty=0,this.drawCalls=[],this.batches=[],this.shapeBuildIndex=0,this.shapeBatchIndex=0,this._bounds=new ft,this.boundsDirty=-1,this.boundsPadding=0,this.batchable=!1,this.indicesUint16=null,this.packer=null,this.packSize=0,this.pack32index=null}get points(){return this.buildData.verts}get closePointEps(){return this.buildData.closePointEps}initAttributes(t){this._buffer=new dt(null,t,!1),this._bufferFloats=new Float32Array,this._bufferUint=new Uint32Array,this._indexBuffer=new dt(null,t,!0),this.addAttribute("aPrev",this._buffer,2,!1,C.FLOAT).addAttribute("aPoint1",this._buffer,2,!1,C.FLOAT).addAttribute("aPoint2",this._buffer,2,!1,C.FLOAT).addAttribute("aNext",this._buffer,2,!1,C.FLOAT).addAttribute("aTravel",this._buffer,1,!1,C.FLOAT).addAttribute("aVertexJoint",this._buffer,1,!1,C.FLOAT).addAttribute("aStyleId",this._buffer,1,!1,C.FLOAT).addAttribute("aColor",this._buffer,4,!0,C.UNSIGNED_BYTE).addIndex(this._indexBuffer),this.strideFloats=12}checkInstancing(t,s){this.packer||(this.packer=new K,this.pack32index=s)}get bounds(){return this.boundsDirty!==this.dirty&&(this.boundsDirty=this.dirty,this.calculateBounds()),this._bounds}invalidate(){this.boundsDirty=-1,this.dirty++,this.batchDirty++,this.shapeBuildIndex=0,this.shapeBatchIndex=0,this.packSize=0,this.buildData.clear();for(let t=0;t<this.drawCalls.length;t++)this.drawCalls[t].clear(),W.push(this.drawCalls[t]);this.drawCalls.length=0;for(let t=0;t<this.batches.length;t++){const s=this.batches[t];s.reset(),at.push(s)}this.batches.length=0}clear(){return this.graphicsData.length>0&&(this.invalidate(),this.clearDirty++,this.graphicsData.length=0),this}drawShape(t,s=null,e=null,r=null){const i=new G(t,s,e,r);return this.graphicsData.push(i),this.dirty++,this}drawHole(t,s=null){if(!this.graphicsData.length)return null;const e=new G(t,null,null,s),r=this.graphicsData[this.graphicsData.length-1];return e.lineStyle=r.lineStyle,r.holes.push(e),this.dirty++,this}destroy(){super.destroy();for(let t=0;t<this.graphicsData.length;++t)this.graphicsData[t].destroy();this.buildData.destroy(),this.buildData=null,this.indexBuffer.destroy(),this.indexBuffer=null,this.graphicsData.length=0,this.graphicsData=null,this.drawCalls.length=0,this.drawCalls=null,this.batches.length=0,this.batches=null,this._bounds=null}containsPoint(t){const s=this.graphicsData;for(let e=0;e<s.length;++e){const r=s[e];if(r.fillStyle.visible&&r.shape&&(r.matrix?r.matrix.applyInverse(t,k):k.copyFrom(t),r.shape.contains(k.x,k.y))){let i=!1;if(r.holes){for(let l=0;l<r.holes.length;l++)if(r.holes[l].shape.contains(k.x,k.y)){i=!0;break}}if(!i)return!0}}return!1}updatePoints(){}updateBufferSize(){this._buffer.update(new Float32Array)}updateBuild(){const{graphicsData:t,buildData:s}=this,e=t.length;for(let r=this.shapeBuildIndex;r<e;r++){const i=t[r];i.strokeStart=0,i.strokeLen=0,i.fillStart=0,i.fillLen=0;const{fillStyle:l,lineStyle:a,holes:c}=i;if(!l.visible&&!a.visible)continue;const p=H[i.type];if(i.clearPath(),p.path(i,s),i.matrix&&this.transformPoints(i.points,i.matrix),i.clearBuild(),!(i.points.length<=2)&&((l.visible||a.visible)&&this.processHoles(c),l.visible&&(i.fillAA=i.fillStyle.smooth&&i.fillStyle.texture===V.WHITE&&c.length===0&&!(i.closeStroke&&i.lineStyle.visible&&!i.lineStyle.shader&&i.lineStyle.alpha>=.99&&i.lineStyle.width*Math.min(i.lineStyle.alignment,1-i.lineStyle.alignment)>=.495),i.fillStart=s.joints.length,c.length?H[P.POLY].fill(i,s):p.fill(i,s),i.fillLen=s.joints.length-i.fillStart),a.visible)){i.strokeStart=s.joints.length,p.line(i,s);for(let u=0;u<c.length;u++){const o=c[u];H[o.type].line(o,s)}i.strokeLen=s.joints.length-i.strokeStart}}this.shapeBuildIndex=e}updateBatches(t){if(!this.graphicsData.length){this.batchable=!0;return}if(this.updateBuild(),!this.validateBatching())return;const{buildData:s,graphicsData:e}=this,r=e.length;this.cacheDirty=this.dirty;let i=null,l=null;this.batches.length>0&&(i=this.batches[this.batches.length-1],l=i.style);for(let a=this.shapeBatchIndex;a<r;a++){const c=e[a],p=c.fillStyle,u=c.lineStyle;if(c.matrix&&this.transformPoints(c.points,c.matrix),!(!p.visible&&!u.visible))for(let o=0;o<2;o++){const h=o===0?p:u;if(!h.visible)continue;const d=h.texture.baseTexture,x=s.vertexSize,v=s.indexSize;d.wrapMode=At.REPEAT,o===0?this.packer.updateBufferSize(c.fillStart,c.fillLen,c.triangles.length,s):this.packer.updateBufferSize(c.strokeStart,c.strokeLen,c.triangles.length,s),s.vertexSize!==x&&(i&&!this._compareStyles(l,h)&&(i.end(v,x),i=null),i||(i=at.pop()||new xt,i.begin(h,v,x),this.batches.push(i),l=h),o===0?i.jointEnd=c.fillStart+c.fillLen:i.jointEnd=c.strokeStart+c.strokeLen)}}if(this.shapeBatchIndex=r,i&&i.end(s.indexSize,s.vertexSize),this.batches.length===0){this.batchable=!0;return}this.batchable=this.isBatchable(),this.batchable?this.packBatches():(this.buildDrawCalls(t),this.updatePack())}updatePack(){const{vertexSize:t,indexSize:s}=this.buildData;if(this.packSize===t)return;const{strideFloats:e,packer:r,buildData:i,batches:l}=this,a=this._buffer,c=this._indexBuffer,p=t*e;if(a.data.length!==p){const o=new ArrayBuffer(p*4);this._bufferFloats=new Float32Array(o),this._bufferUint=new Uint32Array(o),a.data=this._bufferFloats}c.data.length!==s&&(t>65535&&this.pack32index?c.data=new Uint32Array(s):c.data=new Uint16Array(s)),r.beginPack(i,this._bufferFloats,this._bufferUint,c.data);let u=0;for(let o=0;o<this.graphicsData.length;o++){const h=this.graphicsData[o];if(h.fillLen){for(;l[u].jointEnd<=h.fillStart;)u++;r.packInterleavedGeometry(h.fillStart,h.fillLen,h.triangles,l[u].styleId,l[u].rgba)}if(h.strokeLen){for(;l[u].jointEnd<=h.strokeStart;)u++;r.packInterleavedGeometry(h.strokeStart,h.strokeLen,h.triangles,l[u].styleId,l[u].rgba)}}a.update(),c.update(),this.packSize=t}_compareStyles(t,s){if(!t||!s||t.texture.baseTexture!==s.texture.baseTexture||t.color+t.alpha!==s.color+s.alpha||t.shader!==s.shader||t.width!==s.width||t.scaleMode!==s.scaleMode||t.alignment!==s.alignment)return!1;const e=t.matrix||j.IDENTITY,r=s.matrix||j.IDENTITY;return st(e,r)}validateBatching(){if(this.dirty===this.cacheDirty||!this.graphicsData.length)return!1;for(let t=0,s=this.graphicsData.length;t<s;t++){const e=this.graphicsData[t],r=e.fillStyle,i=e.lineStyle;if(r&&!r.texture.baseTexture.valid||i&&!i.texture.baseTexture.valid)return!1}return!0}packBatches(){this.batchDirty++;const t=this.batches;for(let s=0,e=t.length;s<e;s++){const r=t[s];for(let i=0;i<r.size;i++){const l=r.start+i;this.indicesUint16[l]=this.indicesUint16[l]-r.attribStart}}}isBatchable(){return!1}buildDrawCalls(t){for(let r=0;r<this.drawCalls.length;r++)this.drawCalls[r].clear(),W.push(this.drawCalls[r]);this.drawCalls.length=0;let s=W.pop()||new nt;s.begin(t,null);let e=0;this.drawCalls.push(s);for(let r=0;r<this.batches.length;r++){const i=this.batches[r],l=i.style;if(i.attribSize===0)continue;let a=-1;const c=l.getTextureMatrix();s.check(l.shader)&&(a=s.add(l.texture,c,l.width,l.alignment||0,l.packLineScale())),a<0&&(s=W.pop()||new nt,this.drawCalls.push(s),s.begin(t,l.shader),s.start=e,a=s.add(l.texture,c,l.width,l.alignment||0,l.packLineScale())),s.size+=i.size,e+=i.size;const{color:p,alpha:u}=l,o=B.shared.setValue(p).toLittleEndianNumber();i.rgba=B.shared.setValue(o).toPremultiplied(u),i.styleId=a}}processHoles(t){for(let s=0;s<t.length;s++){const e=t[s],r=H[e.type];e.clearPath(),r.path(e,this.buildData),e.matrix&&this.transformPoints(e.points,e.matrix)}}calculateBounds(){const t=this._bounds,s=Yt;let e=j.IDENTITY;this._bounds.clear(),s.clear();for(let r=0;r<this.graphicsData.length;r++){const i=this.graphicsData[r],l=i.shape,a=i.type,c=i.lineStyle,p=i.matrix||j.IDENTITY;let u=0;if(c&&c.visible&&(u=c.width,a!==P.POLY||i.fillStyle.visible?u*=Math.max(0,c.alignment):u*=Math.max(c.alignment,1-c.alignment)),e!==p&&(s.isEmpty()||(t.addBoundsMatrix(s,e),s.clear()),e=p),a===P.RECT||a===P.RREC){const o=l;s.addFramePad(o.x,o.y,o.x+o.width,o.y+o.height,u,u)}else if(a===P.CIRC){const o=l;s.addFramePad(o.x,o.y,o.x,o.y,o.radius+u,o.radius+u)}else if(a===P.ELIP){const o=l;s.addFramePad(o.x,o.y,o.x,o.y,o.width+u,o.height+u)}else{const o=l;t.addVerticesMatrix(e,o.points,0,o.points.length,u,u)}}s.isEmpty()||t.addBoundsMatrix(s,e),t.pad(this.boundsPadding,this.boundsPadding)}transformPoints(t,s){for(let e=0;e<t.length/2;e++){const r=t[e*2],i=t[e*2+1];t[e*2]=s.a*r+s.c*i+s.tx,t[e*2+1]=s.b*r+s.d*i+s.ty}}}lt.BATCHABLE_SIZE=100;const Gt=Ut,{BezierUtils:Qt,QuadraticUtils:qt,ArcUtils:Lt}=Ft,ot={},tt=class extends zt{constructor(n=null){super(),this._geometry=n||new lt,this._geometry.refCount++,this.shader=null,this.shaderSettings={maxStyles:F.SHADER_MAX_STYLES,maxTextures:F.SHADER_MAX_TEXTURES,pixelLine:F.PIXEL_LINE},this.state=Ot.for2d(),this._fillStyle=new Y,this._lineStyle=new et,this._matrix=null,this._holeMode=!1,this.currentPath=null,this.batches=[],this.batchTint=-1,this.batchDirty=-1,this.vertexData=null,this.pluginName="smooth",this._transformID=-1,this._tintColor=new B(16777215),this.blendMode=ct.NORMAL}get geometry(){return this._geometry}clone(){return this.finishPoly(),new tt(this._geometry)}set blendMode(n){this.state.blendMode=n}get blendMode(){return this.state.blendMode}get tint(){return this._tintColor.value}set tint(n){this._tintColor.setValue(n)}get fill(){return this._fillStyle}get line(){return this._lineStyle}lineStyle(n=null,t=0,s=1,e=.5,r=F.LINE_SCALE_MODE){if(typeof n=="number")typeof r=="boolean"&&(r=r?M.NONE:M.NORMAL),n={width:n,color:t,alpha:s,alignment:e,scaleMode:r};else{const i=n.native;i!==void 0&&(n.scaleMode=i?M.NONE:M.NORMAL)}return this.lineTextureStyle(n)}lineTextureStyle(n){n=Object.assign({width:0,texture:V.WHITE,color:n&&n.texture?16777215:0,alpha:1,matrix:null,alignment:.5,native:!1,cap:$.BUTT,join:R.MITER,miterLimit:10,shader:null,scaleMode:F.LINE_SCALE_MODE},n),this.normalizeColor(n),this.currentPath&&this.startPoly();const t=n.width>0&&n.alpha>0;return t?(n.matrix&&(n.matrix=n.matrix.clone(),n.matrix.invert()),Object.assign(this._lineStyle,{visible:t},n)):this._lineStyle.reset(),this}startPoly(){if(this.currentPath){const n=this.currentPath.points,t=this.currentPath.points.length;t>2&&(this.drawShape(this.currentPath),this.currentPath=new it,this.currentPath.closeStroke=!1,this.currentPath.points.push(n[t-2],n[t-1]))}else this.currentPath=new it,this.currentPath.closeStroke=!1}finishPoly(){this.currentPath&&(this.currentPath.points.length>2?(this.drawShape(this.currentPath),this.currentPath=null):this.currentPath.points.length=0)}moveTo(n,t){return this.startPoly(),this.currentPath.points[0]=n,this.currentPath.points[1]=t,this}lineTo(n,t){this.currentPath||this.moveTo(0,0);const s=this.currentPath.points,e=s[s.length-2],r=s[s.length-1];return(e!==n||r!==t)&&s.push(n,t),this}_initCurve(n=0,t=0){this.currentPath?this.currentPath.points.length===0&&(this.currentPath.points=[n,t]):this.moveTo(n,t)}quadraticCurveTo(n,t,s,e){this._initCurve();const r=this.currentPath.points;return r.length===0&&this.moveTo(0,0),qt.curveTo(n,t,s,e,r),this}bezierCurveTo(n,t,s,e,r,i){return this._initCurve(),Qt.curveTo(n,t,s,e,r,i,this.currentPath.points),this}arcTo(n,t,s,e,r){this._initCurve(n,t);const i=this.currentPath.points,l=Lt.curveTo(n,t,s,e,r,i);if(l){const{cx:a,cy:c,radius:p,startAngle:u,endAngle:o,anticlockwise:h}=l;this.arc(a,c,p,u,o,h)}return this}arc(n,t,s,e,r,i=!1){if(e===r)return this;if(!i&&r<=e?r+=pt:i&&e<=r&&(e+=pt),r-e===0)return this;const l=n+Math.cos(e)*s,a=t+Math.sin(e)*s,c=this._geometry.closePointEps;let p=this.currentPath?this.currentPath.points:null;if(p){const u=Math.abs(p[p.length-2]-l),o=Math.abs(p[p.length-1]-a);u<c&&o<c||p.push(l,a)}else this.moveTo(l,a),p=this.currentPath.points;return Lt.arc(l,a,n,t,s,e,r,i,p),this}beginFill(n=0,t=1,s=!1){return this.beginTextureFill({texture:V.WHITE,color:n,alpha:t,smooth:s})}normalizeColor(n){var t,s;const e=B.shared.setValue((t=n.color)!=null?t:0);n.color=e.toNumber(),(s=n.alpha)!=null||(n.alpha=e.alpha)}beginTextureFill(n){n=Object.assign({texture:V.WHITE,color:16777215,alpha:1,matrix:null,smooth:!1},n),this.normalizeColor(n),this.currentPath&&this.startPoly();const t=n.alpha>0;return t?(n.matrix&&(n.matrix=n.matrix.clone(),n.matrix.invert()),Object.assign(this._fillStyle,{visible:t},n)):this._fillStyle.reset(),this}endFill(){return this.finishPoly(),this._fillStyle.reset(),this}drawRect(n,t,s,e){return this.drawShape(new Dt(n,t,s,e))}drawRoundedRect(n,t,s,e,r){return this.drawShape(new wt(n,t,s,e,r))}drawCircle(n,t,s){return this.drawShape(new Ct(n,t,s))}drawEllipse(n,t,s,e){return this.drawShape(new Mt(n,t,s,e))}drawPolygon(...n){let t,s=!0;const e=n[0];e.points?(s=e.closeStroke,t=e.points):Array.isArray(n[0])?t=n[0]:t=n;const r=new it(t);return r.closeStroke=s,this.drawShape(r),this}drawShape(n){return this._holeMode?this._geometry.drawHole(n,this._matrix):this._geometry.drawShape(n,this._fillStyle.clone(),this._lineStyle.clone(),this._matrix),this}clear(){return this._geometry.clear(),this._lineStyle.reset(),this._fillStyle.reset(),this._boundsID++,this._matrix=null,this._holeMode=!1,this.currentPath=null,this}isFastRect(){const n=this._geometry.graphicsData;return n.length===1&&n[0].shape.type===P.RECT&&!n[0].matrix&&!n[0].holes.length&&!(n[0].lineStyle.visible&&n[0].lineStyle.width)}_renderCanvas(n){Gt.prototype._renderCanvas.call(this,n)}_render(n){this.finishPoly();const t=this._geometry,s=n.context.supports.uint32Indices;t.checkInstancing(n.geometry.hasInstance,s),t.updateBatches(this.shaderSettings),t.batchable?(this.batchDirty!==t.batchDirty&&this._populateBatches(),this._renderBatched(n)):(n.batch.flush(),this._renderDirect(n))}_populateBatches(){const n=this._geometry,t=this.blendMode,s=n.batches.length;this.batchTint=-1,this._transformID=-1,this.batchDirty=n.batchDirty,this.batches.length=s,this.vertexData=new Float32Array(n.points);for(let e=0;e<s;e++){const r=n.batches[e],i=r.style.color,l={vertexData:new Float32Array(this.vertexData.buffer,r.attribStart*4*2,r.attribSize*2),blendMode:t,_batchRGB:ut.hex2rgb(i),_tintRGB:i,_texture:r.style.texture,alpha:r.style.alpha,worldAlpha:1};this.batches[e]=l}}_renderBatched(n){if(this.batches.length){n.batch.setObjectRenderer(n.plugins[this.pluginName]),this.calculateVertices(),this.calculateTints();for(let t=0,s=this.batches.length;t<s;t++){const e=this.batches[t];e.worldAlpha=this.worldAlpha*e.alpha,n.plugins[this.pluginName].render(e)}}}_renderDirect(n){const t=this._resolveDirectShader(n);let s=t;const e=this._geometry,r=this.worldAlpha,i=s.uniforms,l=e.drawCalls;i.translationMatrix=this.transform.worldTransform,B.shared.setValue(this._tintColor).premultiply(r).toArray(i.tint),i.resolution=n.renderTexture.current?n.renderTexture.current.resolution:n.resolution;const a=n.projection.transform;if(a){const p=Math.sqrt(a.a*a.a+a.b*a.b);i.resolution*=p}const c=n.renderTexture.current?n.renderTexture.current.multisample:n.multisample;i.expand=(c!==Bt.NONE?2:1)/i.resolution,n.shader.bind(s),n.geometry.bind(e,s),n.state.set(this.state),s=null;for(let p=0,u=l.length;p<u;p++){const o=e.drawCalls[p],h=s!==o.shader;h&&(s=o.shader,s&&(s.uniforms.translationMatrix=this.transform.worldTransform,s.uniforms.tint&&(s.uniforms.tint[0]=i.tint[0],s.uniforms.tint[1]=i.tint[1],s.uniforms.tint[2]=i.tint[2],s.uniforms.tint[3]=i.tint[3])));const{texArray:d,styleArray:x,size:v,start:y}=o,g=d.count,b=s||t,L=b.uniforms.styleTextureId,E=b.uniforms.styleMatrix,I=b.uniforms.styleLine;for(let m=0;m<x.count;m++){L[m]=x.textureIds[m],I[m*2]=x.lines[m*2],I[m*2+1]=x.lines[m*2+1];const N=x.matrices[m];E[m*6]=N.a,E[m*6+1]=N.c,E[m*6+2]=N.tx,E[m*6+3]=N.b,E[m*6+4]=N.d,E[m*6+5]=N.ty}const _=b.uniforms.samplerSize;for(let m=0;m<g;m++)_[m*2]=d.elements[m].width,_[m*2+1]=d.elements[m].height;n.shader.bind(b),h&&n.geometry.bind(e);for(let m=0;m<g;m++)n.texture.bind(d.elements[m],m);n.geometry.draw(Rt.TRIANGLES,v,y)}}_resolveDirectShader(n){let t=this.shader;const s=this.pluginName;return t||(ot[s]||(ot[s]=new z(this.shaderSettings)),t=ot[s]),t}_calculateBounds(){this.finishPoly();const n=this._geometry;if(!n.graphicsData.length)return;const{minX:t,minY:s,maxX:e,maxY:r}=n.bounds;this._bounds.addFrame(this.transform,t,s,e,r)}containsPoint(n){return this.worldTransform.applyInverse(n,tt._TEMP_POINT),this._geometry.containsPoint(tt._TEMP_POINT)}calculateTints(){if(this.batchTint!==this.tint){this.batchTint=this._tintColor.toNumber();for(let n=0;n<this.batches.length;n++){const t=this.batches[n];t._tintRGB=B.shared.setValue(this._tintColor).multiply(t._batchRGB).toLittleEndianNumber()}}}calculateVertices(){const n=this.transform._worldID;if(this._transformID===n)return;this._transformID=n;const t=this.transform.worldTransform,s=t.a,e=t.b,r=t.c,i=t.d,l=t.tx,a=t.ty,c=this._geometry.points,p=this.vertexData;let u=0;for(let o=0;o<c.length;o+=2){const h=c[o],d=c[o+1];p[u++]=s*h+r*d+l,p[u++]=i*d+e*h+a}}closePath(){const n=this.currentPath;return n&&(n.closeStroke=!0),this}setMatrix(n){return this._matrix=n,this}beginHole(){return this.finishPoly(),this._holeMode=!0,this}endHole(){return this.finishPoly(),this._holeMode=!1,this}destroy(n){this._geometry.refCount--,this._geometry.refCount===0&&this._geometry.dispose(),this._matrix=null,this.currentPath=null,this._lineStyle.destroy(),this._lineStyle=null,this._fillStyle.destroy(),this._fillStyle=null,this._geometry=null,this.shader=null,this.vertexData=null,this.batches.length=0,this.batches=null,super.destroy(n)}};let ht=tt;ht.curves=kt,ht._TEMP_POINT=new q;export{at as BATCH_POOL,nt as BatchDrawCall,xt as BatchPart,yt as BatchStyleArray,vt as BuildData,Z as CircleBuilder,W as DRAW_CALL_POOL,Ht as DashLineShader,H as FILL_COMMANDS,Y as FillStyle,f as JOINT_TYPE,M as LINE_SCALE_MODE,et as LineStyle,rt as PolyBuilder,_t as RectangleBuilder,Tt as RoundedRectangleBuilder,K as SegmentPacker,ht as SmoothGraphics,G as SmoothGraphicsData,lt as SmoothGraphicsGeometry,z as SmoothGraphicsShader,st as matrixEquals,F as settings};
//# sourceMappingURL=pixi-graphics-smooth.mjs.map

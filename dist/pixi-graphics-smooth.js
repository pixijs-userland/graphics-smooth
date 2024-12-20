/*!
 * @pixi/graphics-smooth - v1.1.1
 * Compiled Fri, 20 Dec 2024 18:57:14 UTC
 *
 * @pixi/graphics-smooth is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2024, Ivan Popelyshev, All Rights Reserved
 */this.PIXI=this.PIXI||{},this.PIXI.smooth=function(P,x,O,$){"use strict";function K(n,t,s=.001){return n===t||Math.abs(n.a-t.a)<s&&Math.abs(n.b-t.b)<s&&Math.abs(n.c-t.c)<s&&Math.abs(n.d-t.d)<s&&Math.abs(n.tx-t.tx)<s&&Math.abs(n.ty-t.ty)<s}class at{constructor(){this.textureIds=[],this.matrices=[],this.lines=[],this.count=0}clear(){for(let t=0;t<this.count;t++)this.textureIds[t]=null,this.matrices[t]=null;this.count=0}add(t,s,e,a,i,l){const{textureIds:r,matrices:c,lines:p,count:u}=this;t=t*4+i;for(let h=0;h<u;h++)if(p[h*2]===e&&p[h*2+1]===a&&r[h]===t&&K(c[h],s))return h;return u>=l.maxStyles?-1:(r[u]=t,c[u]=s,p[u*2]=e,p[u*2+1]=a,this.count++,u)}}class Z{constructor(){this.texArray=new x.BatchTextureArray,this.styleArray=new at,this.shader=null,this.blend=x.BLEND_MODES.NORMAL,this.start=0,this.size=0,this.TICK=0,this.settings=null,this.data=null}clear(){this.texArray.clear(),this.styleArray.clear(),this.settings=null,this.data=null,this.shader=null}begin(t,s){this.TICK=++x.BaseTexture._globalBatch,this.settings=t,this.shader=s,this.start=0,this.size=0,this.data=null,s&&s.settings&&(this.settings=s.settings)}check(t){return this.size===0?(this.shader=t,!0):this.shader===t}add(t,s,e,a,i){const{texArray:l,TICK:r,styleArray:c,settings:p}=this,{baseTexture:u}=t;if(u._batchEnabled!==r&&l.count===p.maxTextures)return-1;const h=u._batchEnabled!==r?l.count:u._batchLocation,o=c.add(h,s||x.Matrix.IDENTITY,e,a,i,p);return o>=0&&u._batchEnabled!==r&&(u._batchEnabled=r,u._batchLocation=l.count,l.elements[l.count++]=u),o}}class rt{constructor(){this.reset()}begin(t,s,e){this.reset(),this.style=t,this.start=s,this.attribStart=e,this.jointEnd=0}end(t,s){this.attribSize=s-this.attribStart,this.size=t-this.start}reset(){this.style=null,this.size=0,this.start=0,this.attribStart=0,this.attribSize=0,this.styleId=-1,this.rgba=0,this.jointEnd=0}}class lt{constructor(){this.verts=[],this.joints=[],this.vertexSize=0,this.indexSize=0,this.closePointEps=1e-4}clear(){this.verts.length=0,this.joints.length=0,this.vertexSize=0,this.indexSize=0}destroy(){this.verts.length=0,this.joints.length=0}}var f=(n=>(n[n.NONE=0]="NONE",n[n.FILL=1]="FILL",n[n.JOINT_BEVEL=4]="JOINT_BEVEL",n[n.JOINT_MITER=8]="JOINT_MITER",n[n.JOINT_ROUND=12]="JOINT_ROUND",n[n.JOINT_CAP_BUTT=16]="JOINT_CAP_BUTT",n[n.JOINT_CAP_SQUARE=18]="JOINT_CAP_SQUARE",n[n.JOINT_CAP_ROUND=20]="JOINT_CAP_ROUND",n[n.FILL_EXPAND=24]="FILL_EXPAND",n[n.CAP_BUTT=32]="CAP_BUTT",n[n.CAP_SQUARE=64]="CAP_SQUARE",n[n.CAP_ROUND=96]="CAP_ROUND",n[n.CAP_BUTT2=128]="CAP_BUTT2",n))(f||{});class z{constructor(){this.reset()}toJSON(){return this.copyTo({})}clone(){return this.copyTo(new z)}copyTo(t){return t.color=this.color,t.alpha=this.alpha,t.texture=this.texture,t.matrix=this.matrix,t.shader=this.shader,t.visible=this.visible,t.smooth=this.smooth,t.matrixTex=null,t}packLineScale(){return 0}reset(){this.color=16777215,this.alpha=1,this.texture=x.Texture.WHITE,this.matrix=null,this.shader=null,this.visible=!1,this.smooth=!1,this.matrixTex=null}destroy(){this.texture=null,this.matrix=null,this.matrixTex=null}getTextureMatrix(){const t=this.texture;return this.matrix?t.frame.width===t.baseTexture.width&&t.frame.height===t.baseTexture.height?this.matrix:(this.matrixTex?this.matrixTex.copyFrom(this.matrix):this.matrixTex=this.matrix.clone(),this.matrixTex.translate(Number(t.frame.x),Number(t.frame.y)),this.matrixTex):null}}var M=(n=>(n.NONE="none",n.NORMAL="normal",n.HORIZONTAL="horizontal",n.VERTICAL="vertical",n))(M||{});class Y extends z{clone(){return this.copyTo(new Y)}copyTo(t){return t.color=this.color,t.alpha=this.alpha,t.texture=this.texture,t.matrix=this.matrix,t.shader=this.shader,t.visible=this.visible,t.width=this.width,t.alignment=this.alignment,t.cap=this.cap,t.join=this.join,t.miterLimit=this.miterLimit,t.scaleMode=this.scaleMode,t}packLineScale(){switch(this.scaleMode){case"normal":return 1;case"horizontal":return 2;case"vertical":return 3;default:return 0}}reset(){super.reset(),this.smooth=!0,this.color=0,this.width=0,this.alignment=.5,this.cap=O.LINE_CAP.BUTT,this.join=O.LINE_JOIN.MITER,this.miterLimit=10,this.scaleMode="normal"}}const R=class{constructor(){this.strideFloats=12,this.bufferPos=0,this.indexPos=0}updateBufferSize(n,t,s,e){const{joints:a}=e;let i=!1,l=0,r=0;for(let c=n;c<n+t;c++){const p=a[c]&-32,u=a[c]&31;if(u===f.FILL){i=!0,l++;continue}if(u>=f.FILL_EXPAND){l+=3,r+=3;continue}const h=R.vertsByJoint[u]+R.vertsByJoint[p];h>=4&&(l+=h,r+=6+3*Math.max(h-6,0))}i&&(r+=s),e.vertexSize+=l,e.indexSize+=r}beginPack(n,t,s,e,a=0,i=0){this.buildData=n,this.bufFloat=t,this.bufUint=s,this.indices=e,this.bufferPos=a,this.indexPos=i}endPack(){this.buildData=null,this.bufFloat=null,this.bufUint=null,this.indices=null}packInterleavedGeometry(n,t,s,e,a){const{bufFloat:i,bufUint:l,indices:r,buildData:c,strideFloats:p}=this,{joints:u,verts:h}=c;let o=this.bufferPos,d=this.indexPos,v=this.bufferPos/this.strideFloats,m,y,b,_,E,S,I,T,g=!1,A=0;for(let L=n;L<n+t;L++){const B=u[L],q=u[L]&-32,D=u[L]&31;if(D===f.FILL){g=!0,m=h[L*2],y=h[L*2+1],i[o]=m,i[o+1]=y,i[o+2]=m,i[o+3]=y,i[o+4]=m,i[o+5]=y,i[o+6]=m,i[o+7]=y,i[o+8]=A,i[o+9]=16*D,i[o+10]=e,l[o+11]=a,o+=p;continue}if(D>=f.FILL_EXPAND){E=h[L*2],S=h[L*2+1],m=h[L*2+2],y=h[L*2+3],b=h[L*2+4],_=h[L*2+5];const C=L+3;for(let H=0;H<3;H++)i[o]=E,i[o+1]=S,i[o+2]=m,i[o+3]=y,i[o+4]=b,i[o+5]=_,i[o+6]=h[(C+H)*2],i[o+7]=h[(C+H)*2+1],i[o+8]=A,i[o+9]=16*B+H,i[o+10]=e,l[o+11]=a,o+=p;r[d]=v,r[d+1]=v+1,r[d+2]=v+2,d+=3,v+=3;continue}const w=R.vertsByJoint[D]+R.vertsByJoint[q];if(w===0)continue;m=h[L*2],y=h[L*2+1],b=h[L*2+2],_=h[L*2+3],E=h[L*2-2],S=h[L*2-1];const V=Math.sqrt((b-m)*(b-m)+(_-y)*(_-y));R.vertsByJoint[D]===0&&(A-=V),(D&-3)!==f.JOINT_CAP_BUTT?(I=h[L*2+4],T=h[L*2+5]):(I=m,T=y);for(let C=0;C<w;C++)i[o]=E,i[o+1]=S,i[o+2]=m,i[o+3]=y,i[o+4]=b,i[o+5]=_,i[o+6]=I,i[o+7]=T,i[o+8]=A,i[o+9]=16*B+C,i[o+10]=e,l[o+11]=a,o+=p;A+=V,r[d]=v,r[d+1]=v+1,r[d+2]=v+2,r[d+3]=v,r[d+4]=v+2,r[d+5]=v+3,d+=6;for(let C=5;C+1<w;C++)r[d]=v+4,r[d+1]=v+C,r[d+2]=v+C+1,d+=3;v+=w}if(g){for(let L=0;L<s.length;L++)r[d+L]=s[L]+v;d+=s.length}this.bufferPos=o,this.indexPos=d}};let G=R;G.vertsByJoint=[];const N=G.vertsByJoint;for(let n=0;n<256;n++)N.push(0);N[f.FILL]=1;for(let n=0;n<8;n++)N[f.FILL_EXPAND+n]=3;N[f.JOINT_BEVEL]=4+5,N[f.JOINT_BEVEL+1]=4+5,N[f.JOINT_BEVEL+2]=4+5,N[f.JOINT_BEVEL+3]=4+5,N[f.JOINT_ROUND]=4+5,N[f.JOINT_ROUND+1]=4+5,N[f.JOINT_ROUND+2]=4+5,N[f.JOINT_ROUND+3]=4+5,N[f.JOINT_MITER]=4+5,N[f.JOINT_MITER+1]=4+5,N[f.JOINT_MITER+2]=4,N[f.JOINT_MITER+3]=4,N[f.JOINT_CAP_BUTT]=4,N[f.JOINT_CAP_BUTT+1]=4,N[f.JOINT_CAP_SQUARE]=4,N[f.JOINT_CAP_SQUARE+1]=4,N[f.JOINT_CAP_ROUND]=4+5,N[f.JOINT_CAP_ROUND+1]=4+5,N[f.CAP_ROUND]=4;class J{constructor(t,s=null,e=null,a=null){this.shape=t,this.lineStyle=e,this.fillStyle=s,this.matrix=a,this.type=t.type,this.points=[],this.holes=[],this.triangles=[],this.closeStroke=!1,this.clearBuild()}clearPath(){this.points.length=0,this.closeStroke=!0}clearBuild(){this.triangles.length=0,this.fillStart=0,this.fillLen=0,this.strokeStart=0,this.strokeLen=0,this.fillAA=!1}clone(){return new J(this.shape,this.fillStyle,this.lineStyle,this.matrix)}capType(){let t;switch(this.lineStyle.cap){case O.LINE_CAP.SQUARE:t=f.CAP_SQUARE;break;case O.LINE_CAP.ROUND:t=f.CAP_ROUND;break;default:t=f.CAP_BUTT;break}return t}goodJointType(){let t;switch(this.lineStyle.join){case O.LINE_JOIN.BEVEL:t=f.JOINT_BEVEL;break;case O.LINE_JOIN.ROUND:t=f.JOINT_ROUND;break;default:t=f.JOINT_MITER+3;break}return t}jointType(){let t;switch(this.lineStyle.join){case O.LINE_JOIN.BEVEL:t=f.JOINT_BEVEL;break;case O.LINE_JOIN.ROUND:t=f.JOINT_ROUND;break;default:t=f.JOINT_MITER;break}return t}destroy(){this.shape=null,this.holes.length=0,this.holes=null,this.points.length=0,this.points=null,this.lineStyle=null,this.fillStyle=null,this.triangles=null}}const ht=`#version 100
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
}`,ft=`#version 100
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
`,ot=`%PRECISION%
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
`,yt=[`
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
`],xt=`float alpha = 1.0;
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
`;class U extends x.Shader{constructor(t,s=ht,e=ot,a={}){s=U.generateVertexSrc(t,s),e=U.generateFragmentSrc(t,e);const{maxStyles:i,maxTextures:l}=t,r=new Int32Array(l);for(let c=0;c<l;c++)r[c]=c;super(x.Program.from(s,e),Object.assign(a,{styleMatrix:new Float32Array(6*i),styleTextureId:new Float32Array(i),styleLine:new Float32Array(2*i),samplerSize:new Float32Array(2*l),uSamplers:r,tint:new Float32Array([1,1,1,1]),resolution:1,expand:1})),this.settings=t}static generateVertexSrc(t,s=ht){const{maxStyles:e,maxTextures:a}=t;return s=s.replace(/%MAX_TEXTURES%/gi,`${a}`).replace(/%MAX_STYLES%/gi,`${e}`),s}static generateFragmentSrc(t,s=ot){const{maxTextures:e,pixelLine:a}=t;return s=s.replace(/%PRECISION%/gi,ft).replace(/%PIXEL_LINE%/gi,yt[a]).replace(/%PIXEL_COVERAGE%/gi,xt).replace(/%MAX_TEXTURES%/gi,`${e}`).replace(/%FOR_LOOP%/gi,this.generateSampleSrc(e)),s}static generateSampleSrc(t){let s="";s+=`
`,s+=`
`;for(let e=0;e<t;e++)e>0&&(s+=`
else `),e<t-1&&(s+=`if(textureId < ${e}.5)`),s+=`
{`,s+=`
	texColor = texture2D(uSamplers[${e}], vTextureCoord);`,s+=`
}`;return s+=`
`,s+=`
`,s}}const vt=`%PRECISION%
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
`;class mt extends U{constructor(t){const s={maxStyles:16,maxTextures:1,pixelLine:1};super(s,void 0,vt,t||{dash:8,gap:5})}}const F={LINE_SCALE_MODE:M.NORMAL,SHADER_MAX_STYLES:24,SHADER_MAX_TEXTURES:4,PIXEL_LINE:0};class W{path(t,s){const e=t.points;let a,i,l,r,c,p;if(t.type===x.SHAPES.CIRC){const y=t.shape;a=y.x,i=y.y,c=p=y.radius,l=r=0}else if(t.type===x.SHAPES.ELIP){const y=t.shape;a=y.x,i=y.y,c=y.width,p=y.height,l=r=0}else{const y=t.shape,b=y.width/2,_=y.height/2;a=y.x+b,i=y.y+_,c=p=Math.max(0,Math.min(y.radius,Math.min(b,_))),l=b-c,r=_-p}if(!(c>=0&&p>=0&&l>=0&&r>=0)){e.length=0;return}const u=Math.ceil(2.3*Math.sqrt(c+p)),h=u*8+(l?4:0)+(r?4:0);if(e.length=h,h===0)return;if(u===0){e.length=8,e[0]=e[6]=a+l,e[1]=e[3]=i+r,e[2]=e[4]=a-l,e[5]=e[7]=i-r;return}let o=0,d=u*4+(l?2:0)+2,v=d,m=h;{const y=l+c,b=r,_=a+y,E=a-y,S=i+b;if(e[o++]=_,e[o++]=S,e[--d]=S,e[--d]=E,r){const I=i-b;e[v++]=E,e[v++]=I,e[--m]=I,e[--m]=_}}for(let y=1;y<u;y++){const b=Math.PI/2*(y/u),_=l+Math.cos(b)*c,E=r+Math.sin(b)*p,S=a+_,I=a-_,T=i+E,g=i-E;e[o++]=S,e[o++]=T,e[--d]=T,e[--d]=I,e[v++]=I,e[v++]=g,e[--m]=g,e[--m]=S}{const y=l,b=r+p,_=a+y,E=a-y,S=i+b,I=i-b;e[o++]=_,e[o++]=S,e[--m]=I,e[--m]=_,l&&(e[o++]=E,e[o++]=S,e[--m]=I,e[--m]=E)}}fill(t,s){const{verts:e,joints:a}=s,{points:i,triangles:l}=t;if(i.length===0)return;let r,c;if(t.type!==x.SHAPES.RREC){const T=t.shape;r=T.x,c=T.y}else{const T=t.shape;r=T.x+T.width/2,c=T.y+T.height/2}const p=t.matrix,u=p?p.a*r+p.c*c+p.tx:r,h=p?p.b*r+p.d*c+p.ty:c;let o=1;const d=0;if(!t.fillAA){e.push(u,h),a.push(f.FILL),e.push(i[0],i[1]),a.push(f.FILL);for(let T=2;T<i.length;T+=2)e.push(i[T],i[T+1]),a.push(f.FILL),l.push(o++,d,o);l.push(d+1,d,o);return}const v=i.length;let m=i[v-2],y=i[v-1],b=y-i[v-3],_=i[v-4]-m;const E=Math.sqrt(b*b+_*_);b/=E,_/=E;let S,I;for(let T=0;T<v;T+=2){const g=i[T],A=i[T+1];let L=A-y,B=m-g;const q=Math.sqrt(L*L+B*B);L/=q,B/=q;let D=b+L,w=_+B;const V=L*D+B*w;D/=V,w/=V,T>0?(e.push(D),e.push(w)):(S=D,I=w),e.push(u),e.push(h),e.push(m),e.push(y),e.push(g),e.push(A),e.push(0),e.push(0),e.push(D),e.push(w),a.push(f.FILL_EXPAND+2),a.push(f.NONE),a.push(f.NONE),a.push(f.NONE),a.push(f.NONE),a.push(f.NONE),m=g,y=A,b=L,_=B}e.push(S),e.push(I)}line(t,s){const{verts:e,joints:a}=s,{points:i}=t,l=i.length===8?t.goodJointType():f.JOINT_MITER+3,r=i.length;if(r!==0){e.push(i[r-2],i[r-1]),a.push(f.NONE);for(let c=0;c<r;c+=2)e.push(i[c],i[c+1]),a.push(l);e.push(i[0],i[1]),a.push(f.NONE),e.push(i[2],i[3]),a.push(f.NONE)}}}const gt=[];function ct(n,t=!1){const s=n.length;if(s<6)return;let e=0;for(let a=0,i=n[s-2],l=n[s-1];a<s;a+=2){const r=n[a],c=n[a+1];e+=(r-i)*(c+l),i=r,l=c}if(!t&&e>0||t&&e<=0){const a=s/2;for(let i=a+a%2;i<s;i+=2){const l=s-i-2,r=s-i-1,c=i,p=i+1;[n[l],n[c]]=[n[c],n[l]],[n[r],n[p]]=[n[p],n[r]]}}}class tt{path(t,s){const e=t.shape,a=t.points=e.points.slice(),i=s.closePointEps,l=i*i;if(a.length===0)return;const r=new x.Point(a[0],a[1]),c=new x.Point(a[a.length-2],a[a.length-1]),p=t.closeStroke=e.closeStroke;let u=a.length,h=2;for(let o=2;o<u;o+=2){const d=a[o-2],v=a[o-1],m=a[o],y=a[o+1];let b=!0;Math.abs(d-m)<i&&Math.abs(v-y)<i&&(b=!1),b&&(a[h]=a[o],a[h+1]=a[o+1],h+=2)}a.length=u=h,h=2;for(let o=2;o+2<u;o+=2){let d=a[o-2],v=a[o-1];const m=a[o],y=a[o+1];let b=a[o+2],_=a[o+3];d-=m,v-=y,b-=m,_-=y;let E=!0;Math.abs(b*v-_*d)<l&&d*b+v*_<-l&&(E=!1),E&&(a[h]=a[o],a[h+1]=a[o+1],h+=2)}a[h]=a[u-2],a[h+1]=a[u-1],h+=2,a.length=u=h,!(u<=2)&&p&&Math.abs(r.x-c.x)<i&&Math.abs(r.y-c.y)<i&&(a.pop(),a.pop())}line(t,s){const{closeStroke:e,points:a}=t,i=a.length;if(i<=2)return;const{verts:l,joints:r}=s,c=t.jointType(),p=t.capType();let u=0,h,o;e?(h=a[i-2],o=a[i-1],r.push(f.NONE)):(h=a[2],o=a[3],p===f.CAP_ROUND?(l.push(a[0],a[1]),r.push(f.NONE),r.push(f.CAP_ROUND),u=0):(u=p,r.push(f.NONE))),l.push(h,o);for(let d=0;d<i;d+=2){const v=a[d],m=a[d+1];let y=c;d+2>=i?e||(y=f.NONE):d+4>=i&&(e||(p===f.CAP_ROUND&&(y=f.JOINT_CAP_ROUND),p===f.CAP_BUTT&&(y=f.JOINT_CAP_BUTT),p===f.CAP_SQUARE&&(y=f.JOINT_CAP_SQUARE))),y+=u,u=0,l.push(v,m),r.push(y),h=v,o=m}e?(l.push(a[0],a[1]),r.push(f.NONE),l.push(a[2],a[3]),r.push(f.NONE)):(l.push(a[i-4],a[i-3]),r.push(f.NONE))}fill(t,s){let e=t.points;const a=t.holes,i=s.closePointEps,{verts:l,joints:r}=s;if(e.length<6)return;const c=[];let p=e.length;ct(e,!1);for(let d=0;d<a.length;d++){const v=a[d];ct(v.points,!0),c.push(e.length/2),e=e.concat(v.points)}const u=gt;u.length<e.length&&(u.length=e.length);let h=0;for(let d=0;d<=c.length;d++){let v=p/2;d>0&&(d<c.length?v=c[d]:v=e.length>>1),u[h*2]=v-1,u[(v-1)*2+1]=h;for(let m=h;m+1<v;m++)u[m*2+1]=m+1,u[m*2+2]=m;h=v}if(t.triangles=x.utils.earcut(e,c,2),!t.triangles)return;if(!t.fillAA){for(let d=0;d<e.length;d+=2)l.push(e[d],e[d+1]),r.push(f.FILL);return}const{triangles:o}=t;p=e.length;for(let d=0;d<o.length;d+=3){let v=0;for(let m=0;m<3;m++){const y=o[d+m],b=o[d+(m+1)%3];(u[y*2]===b||u[y*2+1]===b)&&(v|=1<<m)}r.push(f.FILL_EXPAND+v),r.push(f.NONE),r.push(f.NONE),r.push(f.NONE),r.push(f.NONE),r.push(f.NONE)}for(let d=0;d<p/2;d++){const v=u[d*2],m=u[d*2+1];let y=e[m*2+1]-e[d*2+1],b=-(e[m*2]-e[d*2]),_=e[d*2+1]-e[v*2+1],E=-(e[d*2]-e[v*2]);const S=Math.sqrt(y*y+b*b);y/=S,b/=S;const I=Math.sqrt(_*_+E*E);_/=I,E/=I;let T=y+_,g=b+E;const A=T*y+g*b;Math.abs(A)<i?(T=y,g=b):(T/=A,g/=A),u[d*2]=T,u[d*2+1]=g}for(let d=0;d<o.length;d+=3){const v=o[d],m=o[d+1],y=o[d+2],b=e[y*2+1]-e[m*2+1],_=-(e[y*2]-e[m*2]),E=e[m*2+1]-e[v*2+1],S=-(e[m*2]-e[v*2]);let I=1;b*S-E*_>0&&(I=2);for(let T=0;T<3;T++){const g=o[d+T*I%3];l.push(e[g*2],e[g*2+1])}for(let T=0;T<3;T++){const g=o[d+T*I%3];l.push(u[g*2],u[g*2+1])}}}}class ut{constructor(){this._polyBuilder=new tt}path(t,s){const e=t.shape,a=e.x,i=e.y,l=e.width,r=e.height,c=t.points;c.length=0,c.push(a,i,a+l,i,a+l,i+r,a,i+r)}line(t,s){const{verts:e,joints:a}=s,{points:i}=t,l=t.goodJointType(),r=i.length;e.push(i[r-2],i[r-1]),a.push(f.NONE);for(let c=0;c<r;c+=2)e.push(i[c],i[c+1]),a.push(l);e.push(i[0],i[1]),a.push(f.NONE),e.push(i[2],i[3]),a.push(f.NONE)}fill(t,s){const{verts:e,joints:a}=s,{points:i,triangles:l}=t;if(l.length=0,!t.fillAA){e.push(i[0],i[1],i[2],i[3],i[4],i[5],i[6],i[7]),a.push(f.FILL,f.FILL,f.FILL,f.FILL),l.push(0,1,2,0,2,3);return}this._polyBuilder.fill(t,s)}}class dt{constructor(){this._circleBuilder=new W}path(t,s){this._circleBuilder.path(t,s)}line(t,s){this._circleBuilder.line(t,s)}fill(t,s){this._circleBuilder.fill(t,s)}}const X={[x.SHAPES.POLY]:new tt,[x.SHAPES.CIRC]:new W,[x.SHAPES.ELIP]:new W,[x.SHAPES.RECT]:new ut,[x.SHAPES.RREC]:new dt},et=[],j=[],k=new x.Point,bt=new $.Bounds;class it extends x.Geometry{constructor(){super(),this.indicesUint16=null,this.initAttributes(!1),this.buildData=new lt,this.graphicsData=[],this.dirty=0,this.batchDirty=-1,this.cacheDirty=-1,this.clearDirty=0,this.drawCalls=[],this.batches=[],this.shapeBuildIndex=0,this.shapeBatchIndex=0,this._bounds=new $.Bounds,this.boundsDirty=-1,this.boundsPadding=0,this.batchable=!1,this.indicesUint16=null,this.packer=null,this.packSize=0,this.pack32index=null}get points(){return this.buildData.verts}get closePointEps(){return this.buildData.closePointEps}initAttributes(t){this._buffer=new x.Buffer(null,t,!1),this._bufferFloats=new Float32Array,this._bufferUint=new Uint32Array,this._indexBuffer=new x.Buffer(null,t,!0),this.addAttribute("aPrev",this._buffer,2,!1,x.TYPES.FLOAT).addAttribute("aPoint1",this._buffer,2,!1,x.TYPES.FLOAT).addAttribute("aPoint2",this._buffer,2,!1,x.TYPES.FLOAT).addAttribute("aNext",this._buffer,2,!1,x.TYPES.FLOAT).addAttribute("aTravel",this._buffer,1,!1,x.TYPES.FLOAT).addAttribute("aVertexJoint",this._buffer,1,!1,x.TYPES.FLOAT).addAttribute("aStyleId",this._buffer,1,!1,x.TYPES.FLOAT).addAttribute("aColor",this._buffer,4,!0,x.TYPES.UNSIGNED_BYTE).addIndex(this._indexBuffer),this.strideFloats=12}checkInstancing(t,s){this.packer||(this.packer=new G,this.pack32index=s)}get bounds(){return this.boundsDirty!==this.dirty&&(this.boundsDirty=this.dirty,this.calculateBounds()),this._bounds}invalidate(){this.boundsDirty=-1,this.dirty++,this.batchDirty++,this.shapeBuildIndex=0,this.shapeBatchIndex=0,this.packSize=0,this.buildData.clear();for(let t=0;t<this.drawCalls.length;t++)this.drawCalls[t].clear(),j.push(this.drawCalls[t]);this.drawCalls.length=0;for(let t=0;t<this.batches.length;t++){const s=this.batches[t];s.reset(),et.push(s)}this.batches.length=0}clear(){return this.graphicsData.length>0&&(this.invalidate(),this.clearDirty++,this.graphicsData.length=0),this}drawShape(t,s=null,e=null,a=null){const i=new J(t,s,e,a);return this.graphicsData.push(i),this.dirty++,this}drawHole(t,s=null){if(!this.graphicsData.length)return null;const e=new J(t,null,null,s),a=this.graphicsData[this.graphicsData.length-1];return e.lineStyle=a.lineStyle,a.holes.push(e),this.dirty++,this}destroy(){super.destroy();for(let t=0;t<this.graphicsData.length;++t)this.graphicsData[t].destroy();this.buildData.destroy(),this.buildData=null,this.indexBuffer.destroy(),this.indexBuffer=null,this.graphicsData.length=0,this.graphicsData=null,this.drawCalls.length=0,this.drawCalls=null,this.batches.length=0,this.batches=null,this._bounds=null}containsPoint(t){const s=this.graphicsData;for(let e=0;e<s.length;++e){const a=s[e];if(a.fillStyle.visible&&a.shape&&(a.matrix?a.matrix.applyInverse(t,k):k.copyFrom(t),a.shape.contains(k.x,k.y))){let i=!1;if(a.holes){for(let l=0;l<a.holes.length;l++)if(a.holes[l].shape.contains(k.x,k.y)){i=!0;break}}if(!i)return!0}}return!1}updatePoints(){}updateBufferSize(){this._buffer.update(new Float32Array)}updateBuild(){const{graphicsData:t,buildData:s}=this,e=t.length;for(let a=this.shapeBuildIndex;a<e;a++){const i=t[a];i.strokeStart=0,i.strokeLen=0,i.fillStart=0,i.fillLen=0;const{fillStyle:l,lineStyle:r,holes:c}=i;if(!l.visible&&!r.visible)continue;const p=X[i.type];if(i.clearPath(),p.path(i,s),i.matrix&&this.transformPoints(i.points,i.matrix),i.clearBuild(),!(i.points.length<=2)&&((l.visible||r.visible)&&this.processHoles(c),l.visible&&(i.fillAA=i.fillStyle.smooth&&i.fillStyle.texture===x.Texture.WHITE&&c.length===0&&!(i.closeStroke&&i.lineStyle.visible&&!i.lineStyle.shader&&i.lineStyle.alpha>=.99&&i.lineStyle.width*Math.min(i.lineStyle.alignment,1-i.lineStyle.alignment)>=.495),i.fillStart=s.joints.length,c.length?X[x.SHAPES.POLY].fill(i,s):p.fill(i,s),i.fillLen=s.joints.length-i.fillStart),r.visible)){i.strokeStart=s.joints.length,p.line(i,s);for(let u=0;u<c.length;u++){const h=c[u];X[h.type].line(h,s)}i.strokeLen=s.joints.length-i.strokeStart}}this.shapeBuildIndex=e}updateBatches(t){if(!this.graphicsData.length){this.batchable=!0;return}if(this.updateBuild(),!this.validateBatching())return;const{buildData:s,graphicsData:e}=this,a=e.length;this.cacheDirty=this.dirty;let i=null,l=null;this.batches.length>0&&(i=this.batches[this.batches.length-1],l=i.style);for(let r=this.shapeBatchIndex;r<a;r++){const c=e[r],p=c.fillStyle,u=c.lineStyle;if(c.matrix&&this.transformPoints(c.points,c.matrix),!(!p.visible&&!u.visible))for(let h=0;h<2;h++){const o=h===0?p:u;if(!o.visible)continue;const d=o.texture.baseTexture,v=s.vertexSize,m=s.indexSize;d.wrapMode=x.WRAP_MODES.REPEAT,h===0?this.packer.updateBufferSize(c.fillStart,c.fillLen,c.triangles.length,s):this.packer.updateBufferSize(c.strokeStart,c.strokeLen,c.triangles.length,s),s.vertexSize!==v&&(i&&!this._compareStyles(l,o)&&(i.end(m,v),i=null),i||(i=et.pop()||new rt,i.begin(o,m,v),this.batches.push(i),l=o),h===0?i.jointEnd=c.fillStart+c.fillLen:i.jointEnd=c.strokeStart+c.strokeLen)}}if(this.shapeBatchIndex=a,i&&i.end(s.indexSize,s.vertexSize),this.batches.length===0){this.batchable=!0;return}this.batchable=this.isBatchable(),this.batchable?this.packBatches():(this.buildDrawCalls(t),this.updatePack())}updatePack(){const{vertexSize:t,indexSize:s}=this.buildData;if(this.packSize===t)return;const{strideFloats:e,packer:a,buildData:i,batches:l}=this,r=this._buffer,c=this._indexBuffer,p=t*e;if(r.data.length!==p){const h=new ArrayBuffer(p*4);this._bufferFloats=new Float32Array(h),this._bufferUint=new Uint32Array(h),r.data=this._bufferFloats}c.data.length!==s&&(t>65535&&this.pack32index?c.data=new Uint32Array(s):c.data=new Uint16Array(s)),a.beginPack(i,this._bufferFloats,this._bufferUint,c.data);let u=0;for(let h=0;h<this.graphicsData.length;h++){const o=this.graphicsData[h];if(o.fillLen){for(;l[u].jointEnd<=o.fillStart;)u++;a.packInterleavedGeometry(o.fillStart,o.fillLen,o.triangles,l[u].styleId,l[u].rgba)}if(o.strokeLen){for(;l[u].jointEnd<=o.strokeStart;)u++;a.packInterleavedGeometry(o.strokeStart,o.strokeLen,o.triangles,l[u].styleId,l[u].rgba)}}r.update(),c.update(),this.packSize=t}_compareStyles(t,s){if(!t||!s||t.texture.baseTexture!==s.texture.baseTexture||t.color+t.alpha!==s.color+s.alpha||t.shader!==s.shader||t.width!==s.width||t.scaleMode!==s.scaleMode||t.alignment!==s.alignment)return!1;const e=t.matrix||x.Matrix.IDENTITY,a=s.matrix||x.Matrix.IDENTITY;return K(e,a)}validateBatching(){if(this.dirty===this.cacheDirty||!this.graphicsData.length)return!1;for(let t=0,s=this.graphicsData.length;t<s;t++){const e=this.graphicsData[t],a=e.fillStyle,i=e.lineStyle;if(a&&!a.texture.baseTexture.valid||i&&!i.texture.baseTexture.valid)return!1}return!0}packBatches(){this.batchDirty++;const t=this.batches;for(let s=0,e=t.length;s<e;s++){const a=t[s];for(let i=0;i<a.size;i++){const l=a.start+i;this.indicesUint16[l]=this.indicesUint16[l]-a.attribStart}}}isBatchable(){return!1}buildDrawCalls(t){for(let a=0;a<this.drawCalls.length;a++)this.drawCalls[a].clear(),j.push(this.drawCalls[a]);this.drawCalls.length=0;let s=j.pop()||new Z;s.begin(t,null);let e=0;this.drawCalls.push(s);for(let a=0;a<this.batches.length;a++){const i=this.batches[a],l=i.style;if(i.attribSize===0)continue;let r=-1;const c=l.getTextureMatrix();s.check(l.shader)&&(r=s.add(l.texture,c,l.width,l.alignment||0,l.packLineScale())),r<0&&(s=j.pop()||new Z,this.drawCalls.push(s),s.begin(t,l.shader),s.start=e,r=s.add(l.texture,c,l.width,l.alignment||0,l.packLineScale())),s.size+=i.size,e+=i.size;const{color:p,alpha:u}=l,h=x.Color.shared.setValue(p).toLittleEndianNumber();i.rgba=x.Color.shared.setValue(h).toPremultiplied(u),i.styleId=r}}processHoles(t){for(let s=0;s<t.length;s++){const e=t[s],a=X[e.type];e.clearPath(),a.path(e,this.buildData),e.matrix&&this.transformPoints(e.points,e.matrix)}}calculateBounds(){const t=this._bounds,s=bt;let e=x.Matrix.IDENTITY;this._bounds.clear(),s.clear();for(let a=0;a<this.graphicsData.length;a++){const i=this.graphicsData[a],l=i.shape,r=i.type,c=i.lineStyle,p=i.matrix||x.Matrix.IDENTITY;let u=0;if(c&&c.visible&&(u=c.width,r!==x.SHAPES.POLY||i.fillStyle.visible?u*=Math.max(0,c.alignment):u*=Math.max(c.alignment,1-c.alignment)),e!==p&&(s.isEmpty()||(t.addBoundsMatrix(s,e),s.clear()),e=p),r===x.SHAPES.RECT||r===x.SHAPES.RREC){const h=l;s.addFramePad(h.x,h.y,h.x+h.width,h.y+h.height,u,u)}else if(r===x.SHAPES.CIRC){const h=l;s.addFramePad(h.x,h.y,h.x,h.y,h.radius+u,h.radius+u)}else if(r===x.SHAPES.ELIP){const h=l;s.addFramePad(h.x,h.y,h.x,h.y,h.width+u,h.height+u)}else{const h=l;t.addVerticesMatrix(e,h.points,0,h.points.length,u,u)}}s.isEmpty()||t.addBoundsMatrix(s,e),t.pad(this.boundsPadding,this.boundsPadding)}transformPoints(t,s){for(let e=0;e<t.length/2;e++){const a=t[e*2],i=t[e*2+1];t[e*2]=s.a*a+s.c*i+s.tx,t[e*2+1]=s.b*a+s.d*i+s.ty}}}it.BATCHABLE_SIZE=100;const _t=O.Graphics,{BezierUtils:Tt,QuadraticUtils:Lt,ArcUtils:pt}=O.graphicsUtils,st={},Q=class extends $.Container{constructor(n=null){super(),this._geometry=n||new it,this._geometry.refCount++,this.shader=null,this.shaderSettings={maxStyles:F.SHADER_MAX_STYLES,maxTextures:F.SHADER_MAX_TEXTURES,pixelLine:F.PIXEL_LINE},this.state=x.State.for2d(),this._fillStyle=new z,this._lineStyle=new Y,this._matrix=null,this._holeMode=!1,this.currentPath=null,this.batches=[],this.batchTint=-1,this.batchDirty=-1,this.vertexData=null,this.pluginName="smooth",this._transformID=-1,this._tintColor=new x.Color(16777215),this.blendMode=x.BLEND_MODES.NORMAL}get geometry(){return this._geometry}clone(){return this.finishPoly(),new Q(this._geometry)}set blendMode(n){this.state.blendMode=n}get blendMode(){return this.state.blendMode}get tint(){return this._tintColor.value}set tint(n){this._tintColor.setValue(n)}get fill(){return this._fillStyle}get line(){return this._lineStyle}lineStyle(n=null,t=0,s=1,e=.5,a=F.LINE_SCALE_MODE){if(typeof n=="number")typeof a=="boolean"&&(a=a?M.NONE:M.NORMAL),n={width:n,color:t,alpha:s,alignment:e,scaleMode:a};else{const i=n.native;i!==void 0&&(n.scaleMode=i?M.NONE:M.NORMAL)}return this.lineTextureStyle(n)}lineTextureStyle(n){n=Object.assign({width:0,texture:x.Texture.WHITE,color:n&&n.texture?16777215:0,alpha:1,matrix:null,alignment:.5,native:!1,cap:O.LINE_CAP.BUTT,join:O.LINE_JOIN.MITER,miterLimit:10,shader:null,scaleMode:F.LINE_SCALE_MODE},n),this.normalizeColor(n),this.currentPath&&this.startPoly();const t=n.width>0&&n.alpha>0;return t?(n.matrix&&(n.matrix=n.matrix.clone(),n.matrix.invert()),Object.assign(this._lineStyle,{visible:t},n)):this._lineStyle.reset(),this}startPoly(){if(this.currentPath){const n=this.currentPath.points,t=this.currentPath.points.length;t>2&&(this.drawShape(this.currentPath),this.currentPath=new x.Polygon,this.currentPath.closeStroke=!1,this.currentPath.points.push(n[t-2],n[t-1]))}else this.currentPath=new x.Polygon,this.currentPath.closeStroke=!1}finishPoly(){this.currentPath&&(this.currentPath.points.length>2?(this.drawShape(this.currentPath),this.currentPath=null):this.currentPath.points.length=0)}moveTo(n,t){return this.startPoly(),this.currentPath.points[0]=n,this.currentPath.points[1]=t,this}lineTo(n,t){this.currentPath||this.moveTo(0,0);const s=this.currentPath.points,e=s[s.length-2],a=s[s.length-1];return(e!==n||a!==t)&&s.push(n,t),this}_initCurve(n=0,t=0){this.currentPath?this.currentPath.points.length===0&&(this.currentPath.points=[n,t]):this.moveTo(n,t)}quadraticCurveTo(n,t,s,e){this._initCurve();const a=this.currentPath.points;return a.length===0&&this.moveTo(0,0),Lt.curveTo(n,t,s,e,a),this}bezierCurveTo(n,t,s,e,a,i){return this._initCurve(),Tt.curveTo(n,t,s,e,a,i,this.currentPath.points),this}arcTo(n,t,s,e,a){this._initCurve(n,t);const i=this.currentPath.points,l=pt.curveTo(n,t,s,e,a,i);if(l){const{cx:r,cy:c,radius:p,startAngle:u,endAngle:h,anticlockwise:o}=l;this.arc(r,c,p,u,h,o)}return this}arc(n,t,s,e,a,i=!1){if(e===a)return this;if(!i&&a<=e?a+=x.PI_2:i&&e<=a&&(e+=x.PI_2),a-e===0)return this;const l=n+Math.cos(e)*s,r=t+Math.sin(e)*s,c=this._geometry.closePointEps;let p=this.currentPath?this.currentPath.points:null;if(p){const u=Math.abs(p[p.length-2]-l),h=Math.abs(p[p.length-1]-r);u<c&&h<c||p.push(l,r)}else this.moveTo(l,r),p=this.currentPath.points;return pt.arc(l,r,n,t,s,e,a,i,p),this}beginFill(n=0,t=1,s=!1){return this.beginTextureFill({texture:x.Texture.WHITE,color:n,alpha:t,smooth:s})}normalizeColor(n){var t,s;const e=x.Color.shared.setValue((t=n.color)!=null?t:0);n.color=e.toNumber(),(s=n.alpha)!=null||(n.alpha=e.alpha)}beginTextureFill(n){n=Object.assign({texture:x.Texture.WHITE,color:16777215,alpha:1,matrix:null,smooth:!1},n),this.normalizeColor(n),this.currentPath&&this.startPoly();const t=n.alpha>0;return t?(n.matrix&&(n.matrix=n.matrix.clone(),n.matrix.invert()),Object.assign(this._fillStyle,{visible:t},n)):this._fillStyle.reset(),this}endFill(){return this.finishPoly(),this._fillStyle.reset(),this}drawRect(n,t,s,e){return this.drawShape(new x.Rectangle(n,t,s,e))}drawRoundedRect(n,t,s,e,a){return this.drawShape(new x.RoundedRectangle(n,t,s,e,a))}drawCircle(n,t,s){return this.drawShape(new x.Circle(n,t,s))}drawEllipse(n,t,s,e){return this.drawShape(new x.Ellipse(n,t,s,e))}drawPolygon(...n){let t,s=!0;const e=n[0];e.points?(s=e.closeStroke,t=e.points):Array.isArray(n[0])?t=n[0]:t=n;const a=new x.Polygon(t);return a.closeStroke=s,this.drawShape(a),this}drawShape(n){return this._holeMode?this._geometry.drawHole(n,this._matrix):this._geometry.drawShape(n,this._fillStyle.clone(),this._lineStyle.clone(),this._matrix),this}clear(){return this._geometry.clear(),this._lineStyle.reset(),this._fillStyle.reset(),this._boundsID++,this._matrix=null,this._holeMode=!1,this.currentPath=null,this}isFastRect(){const n=this._geometry.graphicsData;return n.length===1&&n[0].shape.type===x.SHAPES.RECT&&!n[0].matrix&&!n[0].holes.length&&!(n[0].lineStyle.visible&&n[0].lineStyle.width)}_renderCanvas(n){_t.prototype._renderCanvas.call(this,n)}_render(n){this.finishPoly();const t=this._geometry,s=n.context.supports.uint32Indices;t.checkInstancing(n.geometry.hasInstance,s),t.updateBatches(this.shaderSettings),t.batchable?(this.batchDirty!==t.batchDirty&&this._populateBatches(),this._renderBatched(n)):(n.batch.flush(),this._renderDirect(n))}_populateBatches(){const n=this._geometry,t=this.blendMode,s=n.batches.length;this.batchTint=-1,this._transformID=-1,this.batchDirty=n.batchDirty,this.batches.length=s,this.vertexData=new Float32Array(n.points);for(let e=0;e<s;e++){const a=n.batches[e],i=a.style.color,l={vertexData:new Float32Array(this.vertexData.buffer,a.attribStart*4*2,a.attribSize*2),blendMode:t,_batchRGB:x.utils.hex2rgb(i),_tintRGB:i,_texture:a.style.texture,alpha:a.style.alpha,worldAlpha:1};this.batches[e]=l}}_renderBatched(n){if(this.batches.length){n.batch.setObjectRenderer(n.plugins[this.pluginName]),this.calculateVertices(),this.calculateTints();for(let t=0,s=this.batches.length;t<s;t++){const e=this.batches[t];e.worldAlpha=this.worldAlpha*e.alpha,n.plugins[this.pluginName].render(e)}}}_renderDirect(n){const t=this._resolveDirectShader(n);let s=t;const e=this._geometry,a=this.worldAlpha,i=s.uniforms,l=e.drawCalls;i.translationMatrix=this.transform.worldTransform,x.Color.shared.setValue(this._tintColor).premultiply(a).toArray(i.tint),i.resolution=n.renderTexture.current?n.renderTexture.current.resolution:n.resolution;const r=n.projection.transform;if(r){const p=Math.sqrt(r.a*r.a+r.b*r.b);i.resolution*=p}const c=n.renderTexture.current?n.renderTexture.current.multisample:n.multisample;i.expand=(c!==x.MSAA_QUALITY.NONE?2:1)/i.resolution,n.shader.bind(s),n.geometry.bind(e,s),n.state.set(this.state),s=null;for(let p=0,u=l.length;p<u;p++){const h=e.drawCalls[p],o=s!==h.shader;o&&(s=h.shader,s&&(s.uniforms.translationMatrix=this.transform.worldTransform,s.uniforms.tint&&(s.uniforms.tint[0]=i.tint[0],s.uniforms.tint[1]=i.tint[1],s.uniforms.tint[2]=i.tint[2],s.uniforms.tint[3]=i.tint[3])));const{texArray:d,styleArray:v,size:m,start:y}=h,b=d.count,_=s||t,E=_.uniforms.styleTextureId,S=_.uniforms.styleMatrix,I=_.uniforms.styleLine;for(let g=0;g<v.count;g++){E[g]=v.textureIds[g],I[g*2]=v.lines[g*2],I[g*2+1]=v.lines[g*2+1];const A=v.matrices[g];S[g*6]=A.a,S[g*6+1]=A.c,S[g*6+2]=A.tx,S[g*6+3]=A.b,S[g*6+4]=A.d,S[g*6+5]=A.ty}const T=_.uniforms.samplerSize;for(let g=0;g<b;g++)T[g*2]=d.elements[g].width,T[g*2+1]=d.elements[g].height;n.shader.bind(_),o&&n.geometry.bind(e);for(let g=0;g<b;g++)n.texture.bind(d.elements[g],g);n.geometry.draw(x.DRAW_MODES.TRIANGLES,m,y)}}_resolveDirectShader(n){let t=this.shader;const s=this.pluginName;return t||(st[s]||(st[s]=new U(this.shaderSettings)),t=st[s]),t}_calculateBounds(){this.finishPoly();const n=this._geometry;if(!n.graphicsData.length)return;const{minX:t,minY:s,maxX:e,maxY:a}=n.bounds;this._bounds.addFrame(this.transform,t,s,e,a)}containsPoint(n){return this.worldTransform.applyInverse(n,Q._TEMP_POINT),this._geometry.containsPoint(Q._TEMP_POINT)}calculateTints(){if(this.batchTint!==this.tint){this.batchTint=this._tintColor.toNumber();for(let n=0;n<this.batches.length;n++){const t=this.batches[n];t._tintRGB=x.Color.shared.setValue(this._tintColor).multiply(t._batchRGB).toLittleEndianNumber()}}}calculateVertices(){const n=this.transform._worldID;if(this._transformID===n)return;this._transformID=n;const t=this.transform.worldTransform,s=t.a,e=t.b,a=t.c,i=t.d,l=t.tx,r=t.ty,c=this._geometry.points,p=this.vertexData;let u=0;for(let h=0;h<c.length;h+=2){const o=c[h],d=c[h+1];p[u++]=s*o+a*d+l,p[u++]=i*d+e*o+r}}closePath(){const n=this.currentPath;return n&&(n.closeStroke=!0),this}setMatrix(n){return this._matrix=n,this}beginHole(){return this.finishPoly(),this._holeMode=!0,this}endHole(){return this.finishPoly(),this._holeMode=!1,this}destroy(n){this._geometry.refCount--,this._geometry.refCount===0&&this._geometry.dispose(),this._matrix=null,this.currentPath=null,this._lineStyle.destroy(),this._lineStyle=null,this._fillStyle.destroy(),this._fillStyle=null,this._geometry=null,this.shader=null,this.vertexData=null,this.batches.length=0,this.batches=null,super.destroy(n)}};let nt=Q;return nt.curves=O.curves,nt._TEMP_POINT=new x.Point,P.BATCH_POOL=et,P.BatchDrawCall=Z,P.BatchPart=rt,P.BatchStyleArray=at,P.BuildData=lt,P.CircleBuilder=W,P.DRAW_CALL_POOL=j,P.DashLineShader=mt,P.FILL_COMMANDS=X,P.FillStyle=z,P.JOINT_TYPE=f,P.LINE_SCALE_MODE=M,P.LineStyle=Y,P.PolyBuilder=tt,P.RectangleBuilder=ut,P.RoundedRectangleBuilder=dt,P.SegmentPacker=G,P.SmoothGraphics=nt,P.SmoothGraphicsData=J,P.SmoothGraphicsGeometry=it,P.SmoothGraphicsShader=U,P.matrixEquals=K,P.settings=F,P}({},PIXI,PIXI,PIXI);
//# sourceMappingURL=pixi-graphics-smooth.js.map

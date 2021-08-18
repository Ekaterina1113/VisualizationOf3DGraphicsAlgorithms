var count;
var verticesOfCubeTrans = [
    0,20,0,
    0,-20,0,
    20,0,0,
    -20,0,0,
    0,0,20,
    0,0,-20,
];

var renderer,canvasHeight,canvasWidth,scene,grid;
var camera,controls;
var axisX, axisY,axisZ,cubeAxes, gsc;
var axisXl,axisYl,axisZl, lsc;
var color, intensity, light, light2;

var verticesOfCube,indicesOfFaces,cubeGeometry,cubeMaterial,cube;
var vect, vectDots,dotsGeometry,dotsMaterial,dots;
var matrixCube, matrixTransform, matrixShear, matrixScale, matrixCubeRotate;

var tx, ty, tz, sx, sy, sz, shx, shy, shz, shx2, shy2, shz2, s;

var vertex, scaleMatrix;

var quaternion, angleQuat, vectQuat,line;
var fov,aspect,near,far, matrixPP;


var matrixCubeLSC, matrixTransformLSC, matrixCubeRotateLSC;
var systemCoor;


window.onload = function(){
    $( ".coordinates" ).prop( "disabled", true );
    systemCoor = $("[name='systemCoordinate']");

    matrixCube = new THREE.Matrix4();
    matrixTransform = new THREE.Matrix4();
    matrixShear = new THREE.Matrix4();
    matrixScale = new THREE.Matrix4();
    matrixCubeRotate = new THREE.Matrix4();
    matrixPP = new THREE.Matrix4();

    matrixCubeLSC = new THREE.Matrix4();
    matrixTransformLSC = new THREE.Matrix4();
    matrixCubeRotateLSC = new THREE.Matrix4();

    creatingScene();
    animate();
};


function creatingScene(){
    renderer = new THREE.WebGLRenderer();
    canvasHeight = window.innerHeight*0.5;
    canvasWidth = window.innerWidth*0.5;

    renderer.setSize(canvasWidth, canvasHeight);
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);

    camera.position.set(100, 110, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //**************************************************************
    //**************************************************************

    scene.background = new THREE.Color( 0x222222 );
    scene.fog = new THREE.Fog( 0x000000, 1, 15000 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.update();
    //***********************************************************


    //***********************************************************
    //********************сетка**********************************
    grid = new THREE.GridHelper( 400, 50, 0x808080, 0x808080);
    scene.add( grid );


    //***********************************************************
    //***********глобальная система координат********************
    axisX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 100, 0xff0000, 8, 4);
    axisY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 100, 0x00ff00, 8, 4);
    axisZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 100, 0x0000ff, 8, 4);
    gsc = new THREE.Group();
    gsc.add(axisX);
    gsc.add(axisY);
    gsc.add(axisZ);

    scene.add(gsc);


    //**********************точка*********************************
    dotsGeometry = new THREE.OctahedronBufferGeometry(1, 2);
    dotsMaterial = new THREE.MeshPhongMaterial( { color: 0xb800b1});
    dots = new THREE.Mesh( dotsGeometry, dotsMaterial );

    dots.position.set(0,20,0);
    scene.add(dots);

    //***********************************************************
    //**************Фигура**************************************
    verticesOfCube = [
        0,20,0,
        0,-20,0,
        20,0,0,
        -20,0,0,
        0,0,20,
        0,0,-20,

    ];
    indicesOfFaces = [
        0,4,2,
        0,2,5,
        0,5,3,
        0,3,4,
        1,4,2,
        1,2,5,
        1,5,3,
        1,3,4
    ];
    cubeGeometry = new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, 20, 0);
    cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xe5be01, wireframe: true} );
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

    scene.add(cube);


    //*********************************************************
    //**********локальная система координат куба***************
    cubeAxes = new THREE.AxesHelper(50);
    cubeAxes.material.depthTest = false;
    cube.add(cubeAxes);

    //**********************************************************
    //**********************свет********************************
    color = 0xffffff;
    intensity = 5;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(40, 50, 150);
    scene.add(light);
    light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-40, -50, -150);
    scene.add(light2);

    cube.matrixAutoUpdate = false;
    cubeAxes.matrixAutoUpdate = false;

}
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    renderer.render( scene, camera );
}


function resetMatrix() {
    var matrixReset = new THREE.Matrix4();
    var str;
    var str2;
    for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
            str = "#a";
            str += j;
            str += k;
            str = "#r";
            str += j;
            str += k;
            console.log(str);
            $(str).val(matrixReset.elements[4*j+k]);
            $(str2).val(matrixReset.elements[4*j+k]);
        }
    }
    cube.matrix.identity();
    matrixCube.identity();
    matrixTransform.identity();
    matrixCubeRotate.identity();
    matrixPP.identity();

    scene.remove(line);
    changingVertex();
    animate();
}

function matrixMul() {
    var matrixHelp = matrixTransform.multiply(matrixCubeRotate);
    matrixCube = matrixHelp.multiply(matrixPP);
    matrixCubeLSC = matrixTransformLSC.multiply(matrixCubeRotateLSC);
    cube.matrix = matrixCube;
    changingVertex();
}

function outputMatrix() {
    matrixTransform.identity();
    tx = parseFloat($("#a03").val());
    ty = parseFloat($("#a13").val());
    tz = parseFloat($("#a23").val());

    sx = parseFloat($("#a00").val());
    sy = parseFloat($("#a11").val());
    sz = parseFloat($("#a22").val());

    shx = parseFloat($("#a10").val());
    shy = parseFloat($("#a01").val());
    shz = parseFloat($("#a02").val());

    shx2 = parseFloat($("#a20").val());
    shy2 = parseFloat($("#a21").val());
    shz2 = parseFloat($("#a12").val());

    s = parseFloat($("#a33").val());

    matrixTransform = matrixTransform.set(
        sx, shy, shz, tx,
        shx, sy, shz2, ty,
        shx2, shy2, sz, tz,
        0,0,0,s,
    );


    matrixMul();
    animate();
}

function rotate() {
    scene.remove(line);
    var rx = (document.getElementById("rx").value*Math.PI)/180;
    var ry = (document.getElementById("ry").value*Math.PI)/180;
    var rz = (document.getElementById("rz").value*Math.PI)/180;

    var rotateX = new THREE.Matrix4();
    var rotateY = new THREE.Matrix4();
    var rotateZ = new THREE.Matrix4();

    rotateX = rotateX.makeRotationX(rx);
    rotateY = rotateY.makeRotationY(ry);
    rotateZ = rotateZ.makeRotationZ(rz);

    var elem = $("[name='axes']");
    var str;
    for(i = 0; i < elem.length; i++) {
        if(elem[i].checked) {
            if (elem[i].value == "rotateX") {
                for (var j = 0; j < 4; j++) {
                    for (var k = 0; k < 4; k++) {
                        str = "#r";
                        str += j;
                        str += k;
                        console.log(str);
                        $(str).val(rotateX.elements[4*j+k]);
                    }
                }
                console.log(rotateX, 'rotateX');
            }
            else {
                if (elem[i].value == "rotateY") {
                    for (j = 0; j < 4; j++) {
                        for (k = 0; k < 4; k++) {
                            str = "#r";
                            str += j;
                            str += k;
                            console.log(str);
                            $(str).val(rotateY.elements[4*j+k]);

                        }
                    }
                    console.log(rotateY, 'rotateY');
                } else {
                    for (var q = 0; q < 4; q++) {
                        for (var l = 0; l < 4; l++) {
                            str = "#r";
                            str += q;
                            str += l;
                            console.log(str);
                            $(str).val(rotateZ.elements[4*q+l]);

                        }
                    }
                    console.log(rotateZ, 'rotateZ');
                }
            }
        }
    }
    matrixCubeRotate.identity();
    matrixCube.identity();

    outputMatrix();

    var matrixRes = rotateX.multiply(rotateY);
    matrixCubeRotate = matrixRes.multiply(rotateZ);

    matrixMul();
}


function rotateQuat() {
    var quat_w = ($("#quat_w").val()*Math.PI)/180;
    var quat_vx = parseFloat($("#quat_vx").val());
    var quat_vy = parseFloat($("#quat_vy").val());
    var quat_vz = parseFloat($("#quat_vz").val());

    scene.remove(line);
    angleQuat = quat_w;
    vectQuat = new THREE.Vector3(quat_vx,quat_vy,quat_vz);
    vectQuat.normalize();
    quaternion = new THREE.Quaternion(vectQuat.x,vectQuat.y,vectQuat.z,quat_w);
    quaternion.normalize();

    matrixCubeRotate.identity();
    matrixCube.identity();
    outputMatrix();


    matrixCubeRotate.makeRotationFromQuaternion(quaternion);

    var str;
    for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
            str = "#r";
            str += j;
            str += k;
            console.log(str);
            $(str).val(matrixCubeRotate.elements[4*j+k]);
        }
    }
    matrixMul();

    console.log(tx, ty, tz);
    line = new THREE.ArrowHelper(vectQuat, new THREE.Vector3(tx, ty, tz), 70, 0xfa9805, 8, 4);
    scene.add(line);

    animate();
}


function perspectiveProjection() {
    fov = $("#fov").val();
    aspect = $("#aspect").val();
    near = $("#near").val();
    far = $("#far").val();
    matrixPP = new THREE.Matrix4();
    var s;
    for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
            s = "#pp";
            s += j;
            s += k;
            console.log(s);
            matrixPP.elements[4*j+k] = $(s).val().normalize();
        }
    }
    matrixCube.identity();
    outputMatrix();
    matrixMul();
    changingVertex();
    animate();
}


function changingVertex() {
    vertex = $("[name='vertex']");

    console.log('Выбор вершины');
    for(i = 0; i < vertex.length; i++) {
        if(vertex[i].checked){
            vect = new THREE.Vector4(verticesOfCubeTrans[i*3],
                verticesOfCubeTrans[i*3+1],verticesOfCubeTrans[i*3+2],1.0);
            $("#x").val(verticesOfCube[i*3]);
            $("#y").val(verticesOfCube[i*3+1]);
            $("#z").val(verticesOfCube[i*3+2]);

            scaleMatrix = cube.matrix;
            vect = vect.applyMatrix4(scaleMatrix);
            $("#res_x").val(vect.x);
            $("#res_y").val(vect.y);
            $("#res_z").val(vect.z);
            dots.position.set(vect.x,vect.y,vect.z);
        }
    }

}














//вкладки
function affine_info() {
    $("#pp").hide();
    $("#affineMatrix").hide();


    $("#output_rotate").hide();
    $("#output").hide();
    $( ".coordinates" ).prop( "disabled", true );

    //$("#affine_information").click(function() {
        $("#general_info").hide();

        $("#affine_info").show();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        $("canvas").hide();
    //});
}
function parallel_trans() {
    $("#affineMatrix").show();
    $("#pp").hide();
    $("#output").show();
    $( ".coordinates" ).prop( "disabled", true );

    $("#output_rotate").hide();
    //$("#parallel_translation").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").show();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").show();
    //});

    $( "#a03" ).prop( "disabled", false );
    $( "#a13" ).prop( "disabled", false );
    $( "#a23" ).prop( "disabled", false );

    $( "#LSKa03" ).prop( "disabled", false );
    $( "#LSKa13" ).prop( "disabled", false );
    $( "#LSKa23" ).prop( "disabled", false );
}
function scale() {
    $("#affineMatrix").show();
    $("#pp").hide();
    $("#output").show();
    $( ".coordinates" ).prop( "disabled", true );


    $("#output_rotate").hide();
    //$("#scaling").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").show();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").show();
   // });

    $( "#a00" ).prop( "disabled", false );
    $( "#a11" ).prop( "disabled", false );
    $( "#a22" ).prop( "disabled", false );
    $( "#a33" ).prop( "disabled", false );

    $( "#LSKa00" ).prop( "disabled", false );
    $( "#LSKa11" ).prop( "disabled", false );
    $( "#LSKa22" ).prop( "disabled", false );
    $( "#LSKa33" ).prop( "disabled", false );
}
function shiftin() {
    $("#affineMatrix").show();
    $("#pp").hide();
    $("#output").show();
    $( ".coordinates" ).prop( "disabled", true );


    $("#output_rotate").hide();
    //$("#shifting").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").show();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").show();
    //});


    $( "#a01" ).prop( "disabled", false );
    $( "#a02" ).prop( "disabled", false );
    $( "#a12" ).prop( "disabled", false );

    $( "#a10" ).prop( "disabled", false );
    $( "#a20" ).prop( "disabled", false );
    $( "#a21" ).prop( "disabled", false );

    $( "#LSKa01" ).prop( "disabled", false );
    $( "#LSKa02" ).prop( "disabled", false );
    $( "#LSKa12" ).prop( "disabled", false );

    $( "#LSKa10" ).prop( "disabled", false );
    $( "#LSKa20" ).prop( "disabled", false );
    $( "#LSKa21" ).prop( "disabled", false );
}
function rotat_info() {
    $("#affineMatrix").hide();
    $("#pp").hide();
    $("#output").hide();

    $("#output_rotate").hide();
    //$("#anglesEuler_information").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").show();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").hide();
    //});
}
function rotat() {
    $("#affineMatrix").hide();
    $("#output").show();
    $("#pp").hide();

    $("#output_rotate").show();

    $( ".r" ).prop( "disabled", true );
    $( "#rx" ).prop( "disabled", false );
    $( ".coordinates" ).prop( "disabled", true );

    //$("#anglesEuler_rotation").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").show();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").show();
   // });
}
function rotatQuat_info() {
    $("#affineMatrix").hide();
    $("#output").hide();
    $("#pp").hide();

    $("#output_rotate").hide();
    //$("#quaternion_information").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").show();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").hide();
   // });
}
function rotatQuat() {
    $("#affineMatrix").hide();
    $("#output").show();
    $("#pp").hide();

    $("#output_rotate").show();
    //$("#quaternion_rotation").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").show();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").show();
   // });
}
function projections_info() {
    $("#affineMatrix").hide();
    $("#output").hide();
    $("#pp").hide();

    $("#output_rotate").hide();
    //$("#projections_information").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").show();
        $("#perspectProject").hide();
        $("#orthogonalProject").hide();

        // $("#redactor").hide();

        $("canvas").hide();
   // });

}
function perspectProject() {
    $("#affineMatrix").hide();
    $("#output").show();
    $( ".coordinates" ).prop( "disabled", true );
    $("#pp").show();

    $("#output_rotate").hide();
    //$("#projections_perspective").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").show();
        $("#orthogonalProject").hide();

        $("canvas").show();
   // });
}
function orthogonalProject() {
    $("#affineMatrix").hide();
    $("#output").show();
    $( ".coordinates" ).prop( "disabled", true );
    $("#pp").show();

    $("#output_rotate").hide();
    //$("#projections_orthogonal").click(function() {
        $("#general_info").hide();

        $("#affine_info").hide();
        $("#parallel_trans").hide();
        $("#scale").hide();
        $("#shiftin").hide();

        $("#rotat_info").hide();
        $("#rotat").hide();
        $("#rotatQuat_info").hide();
        $("#rotatQuat").hide();

        $("#projections_info").hide();
        $("#perspectProject").hide();
        $("#orthogonalProject").show();

        $("canvas").show();
    //});
}


//формулы поворота
function radio(){
    var ele = $("[name='axes']");
    for(i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            if (ele[i].value == "rotateX") {
                $(".r").prop("disabled", true);
                $("#rx").prop("disabled", false);
                $("#acexX").show();
                $("#acexY").hide();
                $("#acexZ").hide();
            } else {
                if (ele[i].value == "rotateY") {
                    $(".r").prop("disabled", true);
                    $("#ry").prop("disabled", false);
                    $("#acexX").hide();
                    $("#acexY").show();
                    $("#acexZ").hide();
                } else {
                    $(".r").prop("disabled", true);
                    $("#rz").prop("disabled", false);
                    $("#acexX").hide();
                    $("#acexY").hide();
                    $("#acexZ").show();
                }
            }

    }
}









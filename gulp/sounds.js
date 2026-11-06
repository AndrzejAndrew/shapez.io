const path = require("path");
const fs = require("fs");

function gulptasksSounds($, gulp, buildFolder) {
    const builtSoundsDir = path.join(__dirname, "..", "res_built", "sounds");
    const builtTempDir = path.join(__dirname, "..", "src", "js", "built-temp");

    gulp.task("sounds.clear", () => {
        return gulp.src(builtSoundsDir, { read: false, allowEmpty: true }).pipe($.clean({ force: true }));
    });

    // Dummy task for FFMPEG replacement
    gulp.task("sounds.music", (done) => done());
    gulp.task("sounds.musicHQ", (done) => done());

    // Create dummy sfx.json for Webpack so it doesn't fail
    gulp.task("sounds.sfxCopyAtlas", (done) => {
        if (!fs.existsSync(builtTempDir)) {
            fs.mkdirSync(builtTempDir, { recursive: true });
        }
        
        const dummySfxData = {
            "urls": ["res/sounds/sfx.mp3"],
            "sprite": {} 
        };
        
        fs.writeFileSync(
            path.join(builtTempDir, "sfx.json"), 
            JSON.stringify(dummySfxData)
        );
        done();
    });

    // Skip sprite generation entirely
    gulp.task("sounds.sfx", gulp.series("sounds.sfxCopyAtlas"));

    // Skip heavy copy, since we don't have processed files anyway
    gulp.task("sounds.copy", (done) => done());

    gulp.task("sounds.buildall", gulp.parallel("sounds.music", "sounds.sfx"));
    gulp.task("sounds.buildallHQ", gulp.parallel("sounds.musicHQ", "sounds.sfx"));

    gulp.task("sounds.fullbuild", gulp.series("sounds.clear", "sounds.buildall", "sounds.copy"));
    gulp.task("sounds.fullbuildHQ", gulp.series("sounds.clear", "sounds.buildallHQ", "sounds.copy"));
    gulp.task("sounds.dev", gulp.series("sounds.buildall", "sounds.copy"));
}

module.exports = {
    gulptasksSounds,
};

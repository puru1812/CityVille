/**
 * To use this library declare this
 * ```
 * import { Mathf } from 'Helpers/Mathf';
 * ```
*/

export class Mathf {

    // Constants -----------------------------------------------------------------------------------
    /**
     Use TAU, better than PI (Read Only).
     */
    public static readonly TAU: number = 6.28318530717959;

    /**
     Degrees-to-radians conversion constant (Read Only).
     */
    public static readonly Deg2Rad: number = Mathf.TAU / 360;

    /**
     Radians-to-degrees conversion constant (Read Only).
     */
    public static readonly Rad2Deg: number = 360 / Mathf.TAU;
    // ---------------------------------------------------------------------------------------------


    // Clamping ------------------------------------------------------------------------------------
    /**
     Clamps a value between a minimum float and maximum float value.
     @param value
     @param min
     @param max
     */
    public static Clamp(value: number, min: number, max: number): number {
        if (value < min){
            value = min;
        }
        else if (value > max){
            value = max;
        }
        return value;
    }

    /**
     Clamps a value between a minimum float and maximum float value.
     @param value
     */
    public static Clamp01(value: number): number {
        return Mathf.Clamp(value, 0, 1);
    }

    /**
     Loops the value t, so that it is never larger than length and never smaller than 0.
     @param t
     @param length
     */
    public static Repeat(t: number, length: number): number {
        return t - Math.floor(t / length) * length;
    }
    // ---------------------------------------------------------------------------------------------


    // Interpolation & Remapping -------------------------------------------------------------------
    /**
     Linearly interpolates between a and b by t.
     @param a
     @param b
     @param t
     */
    public static Lerp(a: number, b: number, t: number): number {
        return a + (b - a) * Mathf.Clamp01(t);
    }

    /**
     Linearly interpolates between a and b by t.
     @param a
     @param b
     @param t
     */
    public static LerpUnclamped(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    /**
     Same as Lerp but makes sure the values interpolate correctly when they wrap around 360 degrees.
     @param a
     @param b
     @param t
     */
    public static LerpAngle(a: number, b: number, t: number): number {
        let num = Mathf.Repeat(b - a, 360);
        if (num > 180.0)
        num -= 360;
        return a + num * Mathf.Clamp01(t);
    }

    /**
     Calculates the linear parameter t that produces the interpolant value within the range [a, b].
     @param a
     @param b
     @param value
     */
    public static InverseLerp(a: number, b: number, value: number): number {
        if (a != b){
            return Mathf.Clamp01((value - a) / (b - a));
        }
        return 0;
    }

    /**
     Remaps the value from between iMin to iMax -> between oMin and oMax.
     @param iMin : input Min
     @param iMax : input Max
     @param oMin : output Min
     @param oMax : output Max
     @param value : value to remap
     */
    public static Remap(iMin: number, iMax: number, oMin: number, oMax: number, value): number {
        let t = Mathf.InverseLerp(iMin, iMax, value);
        return Mathf.Lerp(oMin, oMax, t);
    }
    // ---------------------------------------------------------------------------------------------


    // Angles & Rotation ---------------------------------------------------------------------------
    /**
     Calculates the Cross Product between two given Vectors.
     @param a
     @param b
     */
    public static Cross(a: cc.Vec2, b: cc.Vec2 ): number {
        return a.x * b.y - a.y * b.x;
    }

    /**
     Calculates the Dot Product between two given Vectors.
     @param lhs
     @param rhs
     */
    public static Dot(lhs: cc.Vec2, rhs: cc.Vec2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }

    /**
     Calculates the shortest difference between two given angles given in degrees.
     @param current
     @param target
     */
    public static DeltaAngle(current: number, target: number): number {
        let num = Mathf.Repeat(target - current, 360);
        if (num > 180.0){
            num -= 360;
        }
        return num;
    }

    /**
     Calculates the direction from angle given in radians.
     @param aRad
     */
    public static AngToDir(aRad: number): cc.Vec2 {
        return new cc.Vec2(Math.cos(aRad), Math.sin(aRad));
    }

    /**
     Calculates the angle in radians from a given direction.
     @param dir
     */
    public static DirToAng(dir: cc.Vec2): number {
        return Math.atan2(dir.y, dir.x);
    }

    /**
     Calculates the signed angle in radians between two given direction.
     @param a
     @param b
     */
    public static SignedAngle(a: cc.Vec2, b: cc.Vec2): number {
        // -tau/2 to tau/2
        return Mathf.AngleBetween(a, b) * Math.sign(Mathf.Cross(a, b));
    }

    /**
     Calculates the angle in radians between two given direction.
     @param a
     @param b
     */
    public static AngleBetween(a: cc.Vec2, b: cc.Vec2): number {
        return Math.acos(Mathf.Dot(a.normalizeSelf(), b.normalizeSelf()));
    }

    /**
     Calculates the clockwise angle in radians.
     @param from
     @param to
     */
    public static AngleFromToCW(from: cc.Vec2, to: cc.Vec2): number {
        return Mathf.Cross(from, to) < 0 ? Mathf.AngleBetween(from, to) : Mathf.TAU - Mathf.AngleBetween(from, to);
    }

    /**
     Calculates the counter-clockwise angle in radians.
     @param from
     @param to
     */
    public static AngleFromToCCW(from: cc.Vec2, to: cc.Vec2): number {
        return Mathf.Cross(from, to) > 0 ? Mathf.AngleBetween(from, to) : Mathf.TAU - Mathf.AngleBetween(from, to);
    }
    // ---------------------------------------------------------------------------------------------


    // Vectors and Quaternions ---------------------------------------------------------------------
    /**
     Returns the distance between the two given vectors, expensive than SquaredDistance.
     @param a
     @param b
     */
    public static UnsignedDistance(a: cc.Vec2, b: cc.Vec2): number {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }

    /**
     Returns the squared distance between the two given vectors, efficient than Distance.
     @param a
     @param b
     */
    public static SquaredUnsignedDistance(a: cc.Vec2, b: cc.Vec2): number {
        return (((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }

    /**
     Returns the distance from (a) vector to (b) vector, expensive than SquaredSignedDistance.
     @param a
     @param b
     */
    public static SignedDistance(a: cc.Vec2, b: cc.Vec2): number {
        return Math.sign(Mathf.Dot(a, b)) * Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }

    /**
     Returns the squared distance from (a) vector to (b) vector, efficient than SignedDistance.
     @param a
     @param b
     */
    public static SquaredSignedDistance(a: cc.Vec2, b: cc.Vec2): number {
        return Math.sign(Mathf.Dot(a, b)) * (((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
    }
    // ---------------------------------------------------------------------------------------------
}
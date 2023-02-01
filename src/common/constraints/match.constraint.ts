import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
/**
 * 判断两个字段的值是否相等的验证规则
 */
@ValidatorConstraint({ name: 'isMatch' })
export class MatchConstraint implements ValidatorConstraintInterface {
    /**
     * 定义验证逻辑
     * @param value 被装饰的属性的值
     * @param args {@link ValidationArguments}
     */
    validate(value: any, args: ValidationArguments) {
        const [relatedProperty] = args.constraints;
        // 需要对比的值
        const relatedValue = (args.object as any)[relatedProperty];
        return value === relatedValue;
    }

    /**
     * 验证失败是默认返回的错误消息
     */
    defaultMessage(args: ValidationArguments) {
        const [relatedProperty] = args.constraints;
        return `${relatedProperty} and ${args.property} don't match`;
    }
}
/**
 * 判断DTO中两个属性的值是否相等的验证规则
 * @param relatedProperty 用于对比的属性名称
 * @param validationOptions class-validator库的选项
 * @example {@IsMatch('password', {message: '两次输入密码不匹配'})}
 */
export function IsMatch(relatedProperty: string, validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [relatedProperty],
            validator: MatchConstraint,
        });
    };
}

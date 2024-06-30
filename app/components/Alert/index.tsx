import { InfoIcon } from '~/icons/InfoIcon';
import { WarningIcon } from '~/icons/WarningIcon';
import { ErrorIcon } from '~/icons/ErrorIcon';

export enum AlertStatus {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
}

type AlertProps = {
  title: string;
  description?: string;
  status?: AlertStatus;
};

const config = {
  error: {
    style: 'bg-red-100 border-red-500 text-red-600',
    icon: <ErrorIcon />,
  },
  warning: {
    style: 'bg-orange-100 border-orange-500 text-orange-600',
    icon: <WarningIcon />,
  },
  success: {
    style: 'bg-teal-100 border-teal-500 text-teal-900 ',
    icon: <InfoIcon />,
  },
};

export function Alert({
  title,
  description,
  status = AlertStatus.SUCCESS,
}: AlertProps) {
  return (
    <div
      className={`${config[status].style} border-t-4 rounded-b px-4 py-3 shadow-md`}
      role="alert"
    >
      <div className="flex">
        <div className="py-1">{config[status].icon}</div>
        <div>
          <p className="font-bold">{title}</p>
          {description && <p className="text-sm">{description}</p>}
        </div>
      </div>
    </div>
  );
}

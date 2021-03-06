import React, { FC } from 'react';
import styled from 'styled-components';
import { userInfoQuery } from 'stores/user';
import avatar from 'assets/images/avatar.svg';
import { useRecoilQuery } from 'hooks/recoil';
import { MixinCircle, MixinCommonTransition, MixinSquare } from 'styles/mixins';
import { message, Popover, Button, Row } from 'antd';
import GridRow from 'components/_base/GridRow';
import { Public } from 'components/IconPark';
import LanguageSwitch from './LanguageSwitch';
import { Redirect, useHistory } from 'react-router-dom';
import { logout } from 'services/user';
import { useTranslation } from 'react-i18next';
import store from 'store2';
import LOCAL_STORAGE_KEYS from 'shared/localStorageKeys';
import { useResetRecoilState } from 'recoil';
import { ErrorCodes } from 'typings/app';
import i18n from 'i18n';

const Container = styled.div`
  ${MixinCommonTransition()}
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background: var(--gray3);
  }
`;

const Avatar = styled.img`
  ${MixinSquare(24)}
  border-radius: 50%;
`;

const EmptyAvatar = styled.div`
  ${MixinSquare(32)}

  border-radius: 50%;
  border: 4px solid transparent;
  background-color: var(--gray3);
  background-clip: content-box;
`;
const UsernameRow = styled(GridRow)`
  width: 300px;
  height: 45px;

  > .username {
    font-size: 16px;
    margin-bottom: 0;
  }
`;
const Role = styled.div`
  display: flex;
  align-items: center;
  padding: 3px;
  padding-right: 10px;
  border-radius: 100px;
  font-size: 12px;
  line-height: 1;
  font-weight: normal;
  background-color: var(--gray3);

  &::before {
    ${MixinCircle(14)}
    content: '';
    display: block;
    margin-right: 4px;
    background-color: var(--darkGray8);
  }
`;
const LanguageRow = styled(Row)`
  height: 40px;
  margin-bottom: 10px;
`;
const LogoutButton = styled(Button)`
  width: 100%;
`;

const AccountPopover: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const resetUserInfo = useResetRecoilState(userInfoQuery);

  return (
    <div>
      <LanguageRow justify="space-between" align="middle">
        <GridRow gap="5">
          <Public />
          {t('app.switch_lng')}
        </GridRow>
        <LanguageSwitch />
      </LanguageRow>
      <LogoutButton size="large" onClick={onLogoutClick}>
        {t('app.logout')}
      </LogoutButton>
    </div>
  );

  async function onLogoutClick() {
    try {
      await logout();
      store.remove(LOCAL_STORAGE_KEYS.current_user);
      resetUserInfo();
      history.push('/login');
    } catch (error) {
      message.error(error.message);
    }
  }
};

const Username: FC<{ name: string }> = ({ name }) => {
  return (
    <UsernameRow gap="10">
      <h3 className="username">{name}</h3>
      <Role>管理员</Role>
    </UsernameRow>
  );
};

function HeaderAccount() {
  const { isLoading, data: userInfo, error } = useRecoilQuery(userInfoQuery);

  if (error && error.code === ErrorCodes.TokenExpired) {
    message.info(i18n.t('error.token_expired'));
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return <EmptyAvatar />;
  }

  if (Boolean(error)) {
    return null;
  }

  return (
    <Container>
      <Popover
        content={<AccountPopover />}
        trigger="hover"
        title={<Username name={userInfo?.username || ''} />}
        placement="bottomLeft"
      >
        <Avatar src={avatar} alt="avatar" className="user-avatar" />
      </Popover>
    </Container>
  );
}

export default HeaderAccount;

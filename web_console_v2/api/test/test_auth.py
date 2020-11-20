# Copyright 2020 The FedLearner Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# coding: utf-8

import json
import unittest
from http import HTTPStatus

from fedlearner_webconsole.app import create_app, db
from common import BaseTestCase


class TestAuth(BaseTestCase):
    def test_signin(self):
        self.signout_helper()
        resp = self.post_helper(
            '/api/v2/auth/signup',
            data={
                'username': 'ada',
                'password': 'ada'
            })
        self.assertEqual(resp.status_code, HTTPStatus.UNAUTHORIZED)

        resp = self.client.post(
            '/api/v2/auth/signin',
            data=json.dumps({
                'username': 'ada',
                'password': 'invalid' 
            }),
            content_type='application/json')
        self.assertEqual(resp.status_code, HTTPStatus.UNAUTHORIZED)

        self.signin_helper()

        resp = self.post_helper(
            '/api/v2/auth/signup',
            data={
                'username': 'ada',
                'password': 'ada'
            })
        self.assertEqual(resp.status_code, HTTPStatus.CONFLICT)

        resp = self.post_helper(
            '/api/v2/auth/signup',
            data={
                'username': 'ada1',
                'password': 'ada1'
            })
        self.assertEqual(resp.status_code, HTTPStatus.CREATED)

        self.signin_helper('ada1', 'ada1')


if __name__ == '__main__':
    unittest.main()